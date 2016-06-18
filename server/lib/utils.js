
export function isModelMember(userId, model) {
  return model && model.hasMember(userId);
}
