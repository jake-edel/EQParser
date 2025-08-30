
class LogLine {
  timestamp = ''
  text = ''
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