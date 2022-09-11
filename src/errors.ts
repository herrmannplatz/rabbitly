export function logErrorAndExit(error: Error): void {
  console.log(`💥 ${error.message}`)
  process.exit(1)
}
