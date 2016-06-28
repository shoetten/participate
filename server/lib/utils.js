import {Models} from '/lib/collections';
import {check, Match} from 'meteor/check';

export function isModelMember(userId, model) {
  return model && model.hasMember(userId);
}

export function markModelModified(modelId) {
  Models.update(modelId, {$set: {modifiedAt: new Date()}});
}

export function checkUserPermissions(userId, modelId) {
  // Is user allowed to edit this model?
  const model = Models.findOne(modelId);
  check(model, Match.Where((m) => (
    isModelMember(userId, m)
  )));
}
