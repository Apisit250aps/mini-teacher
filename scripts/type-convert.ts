import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface ConverterConfig {
    inputDir: string;
    outputDir: string;
    namespace: string;
}

class TspConverter {
    private config: ConverterConfig;

    constructor(config: ConverterConfig) {
        this.config = config;
    }

    // จุดเริ่มรันระบบ
    public run(): void {
        if (!fs.existsSync(this.config.outputDir)) {
            fs.mkdirSync(this.config.outputDir, { recursive: true });
        }

        const files = fs.readdirSync(this.config.inputDir)
                        .filter(file => this.shouldProcessFile(file));

        this.cleanupLegacyOutputFiles();

        files.forEach(file => {
            const inputPath = path.join(this.config.inputDir, file);
            const outputPath = path.join(this.config.outputDir, this.getOutputFileName(file));
            
            console.log(`🚀 Processing: ${file}`);
            const tspContent = this.convertFile(inputPath);

            if (!tspContent) {
                console.log(`⏭️ Skip (no model/enum): ${file}`);
                return;
            }

            fs.writeFileSync(outputPath, tspContent);
        });

        console.log('✨ Conversion completed!');
    }

    private shouldProcessFile(fileName: string): boolean {
        if (!fileName.endsWith('.ts')) {
            return false;
        }

        return !/(\.repo|\.repository)\.d\.ts$/i.test(fileName);
    }

    private getOutputFileName(fileName: string): string {
        if (fileName.endsWith('.d.ts')) {
            return fileName.replace(/\.d\.ts$/, '.tsp');
        }

        return fileName.replace(/\.ts$/, '.tsp');
    }

    private cleanupLegacyOutputFiles(): void {
        const outputFiles = fs.readdirSync(this.config.outputDir);

        outputFiles
            .filter(file => file.endsWith('.d.tsp'))
            .forEach(file => {
                fs.unlinkSync(path.join(this.config.outputDir, file));
                console.log(`🧹 Removed legacy file: ${file}`);
            });
    }

    private convertFile(filePath: string): string | null {
        const program = ts.createProgram([filePath], {});
        const sourceFile = program.getSourceFile(filePath);
        if (!sourceFile) return null;

        let body = '';

        // วนลูปหา Top-level nodes ในไฟล์
        ts.forEachChild(sourceFile, (node) => {
            if (ts.isInterfaceDeclaration(node)) {
                body += this.parseInterface(node, sourceFile);
            } else if (ts.isEnumDeclaration(node)) {
                body += this.parseEnum(node, sourceFile);
            }
        });

        if (!body.trim()) {
            return null;
        }

        let content = `import "@typespec/http";\nusing TypeSpec.Http;\n\n`;
        content += `namespace ${this.config.namespace};\n\n`;
        content += body;

        return content;
    }

    private parseInterface(node: ts.InterfaceDeclaration, source: ts.SourceFile): string {
        let modelStr = `model ${node.name.text} {\n`;
        
        node.members.forEach(member => {
            if (ts.isPropertySignature(member)) {
                const name = member.name.getText(source);
                const isOptional = member.questionToken ? '?' : '';
                const type = this.mapType(member.type?.getText(source) || 'any');
                
                modelStr += `  ${name}${isOptional}: ${type};\n`;
            }
        });

        modelStr += `}\n\n`;
        return modelStr;
    }

    private parseEnum(node: ts.EnumDeclaration, source: ts.SourceFile): string {
        let enumStr = `enum ${node.name.text} {\n`;
        node.members.forEach(m => {
            enumStr += `  ${m.name.getText(source)},\n`;
        });
        enumStr += `}\n\n`;
        return enumStr;
    }

    private mapType(tsType: string): string {
        const mapping: Record<string, string> = {
            'string': 'string',
            'number': 'float64',
            'boolean': 'boolean',
            'any': 'unknown',
            'Date': 'utcDateTime',
            'void': 'void'
        };

        // จัดการ Array เช่น string[] -> string[]
        if (tsType.endsWith('[]')) {
            const base = tsType.replace('[]', '');
            return `${this.mapType(base)}[]`;
        }

        return mapping[tsType] ?? tsType;
    }
}

// --- การเรียกใช้งาน ---
const converter = new TspConverter({
    inputDir: './src/models/domain',
    outputDir: './src/spec/models',
    namespace: 'MiniTeacherService'
});

converter.run();