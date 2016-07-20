import {Models} from '/lib/collections';
import {check, Match} from 'meteor/check';

export function markModelModified(modelId) {
  Models.update(modelId, {$set: {modifiedAt: new Date()}});
}

export function isModelMember(userId, modelId) {
  const model = Models.findOne(modelId);
  return model && model.hasMember(userId);
}

export function isRemovedMember(userId, modelId) {
  const model = Models.findOne(modelId);
  return model && model.hasRemovedMember(userId);
}

export function isModelAdmin(userId, modelId) {
  const model = Models.findOne(modelId);
  return model && model.hasAdmin(userId);
}

export function checkUserPermissions(userId, modelId, action = 'edit') {
  // Is user allowed to edit this model?
  check(modelId, Match.Where((id) => (
    action === 'admin' ? isModelAdmin(userId, id) : isModelMember(userId, id)
  )));
}
