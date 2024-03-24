import React from 'react';

interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

interface ModelEditorProps {
  params: Param[];
  model: Model;
  onUpdateModel: (model: Model) => void;
}

interface ModelEditorState {
  paramValues: Map<number, string>;
}

interface ModelEditorProps {
    params: Param[];
    model: Model;
    onUpdateModel: (model: Model) => void;
  }


class ModelEditor extends React.Component<ModelEditorProps, ModelEditorState> {
  constructor(props: ModelEditorProps) {
    super(props);
    this.state = {
      paramValues: this.getParamValuesMap(props.model.paramValues)
    };
  }

  componentDidUpdate(prevProps: ModelEditorProps) {
    if (prevProps.model !== this.props.model) {
      this.setState({
        paramValues: this.getParamValuesMap(this.props.model.paramValues)
      });
    }
  }

  getParamValuesMap(paramValues: ParamValue[]): Map<number, string> {
    const paramValuesMap = new Map<number, string>();
    paramValues.forEach(paramValue => {
      paramValuesMap.set(paramValue.paramId, paramValue.value);
    });
    return paramValuesMap;
  }

  handleParamValueChange(paramId: number, value: string) {
    const { paramValues } = this.state;
    paramValues.set(paramId, value);
    this.setState({ paramValues }, () => {
      this.updateModel();
    });
  }

  updateModel() {
    const { onUpdateModel } = this.props;
    const { paramValues } = this.state;
    const updatedParamValues: ParamValue[] = [];
    paramValues.forEach((value, paramId) => {
      updatedParamValues.push({ paramId, value });
    });
    onUpdateModel({ paramValues: updatedParamValues });
  }

  getModel(): Model {
    const { paramValues } = this.state;
    const model: Model = {
      paramValues: []
    };
    paramValues.forEach((value, paramId) => {
      model.paramValues.push({ paramId, value });
    });
    return model;
  }

  render() {
    const { params } = this.props;
    const { paramValues } = this.state;

    return (
      <div>
        {params.map(param => (
          <div key={param.id}>
            <label>{param.name}</label>
            <input
              type="text"
              value={paramValues.get(param.id) || ''}
              onChange={e => this.handleParamValueChange(param.id, e.target.value)}
            />
          </div>
        ))}
      </div>
    );
  }
}

// export default ModelEditor;

const params:Param[] = [
  { id: 1, name: 'Назначение', type: 'string' },
  { id: 2, name: 'Длина', type: 'string' }
];

const model:Model = {
  paramValues: [
    { paramId: 1, value: 'повседневное' },
    { paramId: 2, value: 'макси' }
  ]
};

function App() {
  function handleUpdateModel(updatedModel: Model) {
    console.log(updatedModel);
  }

  return (
    <div>
      <ModelEditor params={params} model={model} onUpdateModel={handleUpdateModel} />
    </div>
  );
}

export default App;
