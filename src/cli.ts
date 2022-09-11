#!/usr/bin/env node

import rabbitly from '.'
import { logErrorAndExit } from './errors'

async function main() {
  try {
    await rabbitly()
  } catch (error) {
    if (error instanceof Error) {
      logErrorAndExit(error)
    }
    logErrorAndExit(new Error(`An error occured; ${error}`))
  }
}

main()
