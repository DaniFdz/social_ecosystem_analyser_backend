const INVALID_WORDS = [
  'child porn',
  'child\'s porn',
  'childs porn',
  'drug'
]

function createExpression (): string {
  return `^.*(${INVALID_WORDS.join('|')}).*$`
}

export function validateTopic (topic: string): boolean {
  const regex = new RegExp(createExpression(), 'g')
  return !regex.test(topic.replace('\n', ''))
}
