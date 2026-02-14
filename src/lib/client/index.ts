import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'
import type { paths } from '@/lib/client/api/v1'

const fetchClient = createFetchClient<paths>()
const client = createClient(fetchClient)

export default client
