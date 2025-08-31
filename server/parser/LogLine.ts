
class LogLine {
  timestamp = ''
  text = ''
  // TODO: THIS IS STRIPPING CHAR LEVEL FROM /WHO FIX IT
  // ALSO IMPLEMENT /WHO
  linePattern = /^(\[.*\]) (.+)$/;

  constructor(line: string) {
    const match = this.linePattern.exec(line)
    if (match) {
      this.timestamp = match[1]
      this.text = match[2]
    }
  }
}

export default LogLine