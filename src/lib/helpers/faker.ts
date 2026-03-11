import { studentCreateSchema } from '@/core/domain/schema'
import { base, th, en, Faker } from '@faker-js/faker'

export const fake = new Faker({
  locale: [th, en, base],
})

type StudentGeneratorOptions = {
  teacherId: string
  length?: number
  code_prefix?: string
  male?: number
}

export const studentGenerator = ({
  teacherId,
  length = 10,
  code_prefix = 'STU',
  male = 5,
}: StudentGeneratorOptions) => {
  return Array.from({ length }).map((_, i) => {
    const gender = i < male ? 'male' : 'female'
    return studentCreateSchema.parse({
      teacherId,
      code: `${code_prefix}${String(i + 1).padStart(length.toString().length, '0')}`,
      prefix: gender === 'male' ? 'นาย' : 'นางสาว',
      firstName: fake.person.firstName(gender),
      lastName: fake.person.lastName(gender),
    })
  })
}

function main() {
  const students = studentGenerator({
    teacherId: '00000000-0000-0000-0000-000000000000',
  })
  console.table(students)
}

main()
