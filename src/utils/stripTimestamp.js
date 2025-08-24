  export default function stripTimestamp(line) {
    return line.replace(/^\[[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{2}:\d{2}:\d{2} \d{4}\]\s*/, '').trim();
  }