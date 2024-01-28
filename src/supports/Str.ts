const withSign = (command: string): string => process.env.COMMAND_SIGN + command

export {
    withSign
}