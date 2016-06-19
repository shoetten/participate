import {Models} from '/lib/collections';

export function isModelMember(userId, model) {
  return model && model.hasMember(userId);
}

export function markModelModified(modelId) {
  Models.update(modelId, {$set: {modifiedAt: new Date()}});
}
