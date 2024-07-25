import { validateTopic } from '@/api/v1/topics/lib/validateTopic'
import { describe, it, expect } from '@jest/globals'

describe('Validate function', () => {
  it('Should return false if the topic contains any non valid word', () => {
    expect(!validateTopic('drug'))
    expect(!validateTopic('drugs'))
    expect(!validateTopic('i make drugs for fun'))
  })
  it('Should return true if the topic does not contain any non valid word', () => {
    expect(validateTopic('test'))
    expect(validateTopic('test test test'))
  })
})
