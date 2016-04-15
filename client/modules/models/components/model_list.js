import React from 'react';

const ModelList = ({models}) => (
  <div className="modellist">
    <ul>
      {models.map(model => (
        <li key={model._id}>
          <a href={`/model/${model._id}/${model.slug}`}>{model.title}</a>
          <span>: {model.modifiedAt}</span>
        </li>
      ))}
    </ul>
  </div>
);

ModelList.propTypes = {
  models: React.PropTypes.array.isRequired,
};

export default ModelList;
