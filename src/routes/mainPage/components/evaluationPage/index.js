import { Card, Form,Button ,Input, Divider,Tag} from "antd"
import { getEvaluationItem ,getDictionary} from "../../../../api"
import {useState,useEffect, useLayoutEffect} from "react"
import {
    EditableProTable,
    ProCard,
    ProFormField,
    useRefFunction,
  } from '@ant-design/pro-components';
// import './index.css'
function EvaluationPage() {
    const [item,setItem]=useState([])
    // 影响用户字典
    const [impact_user_dictionaries,setImpactUserDictionaries]=useState([]);
    // 危险类型字段
    const [risk_classification_dictionaries,setRiskClassificationDictionaries]=useState([]);
    // 可能性字典
    const [likelihood_dictionaries,setLikelihoodDictionaries]=useState([]);
    // 影响系统字典
    const [impact_system_dictionaries,setImpactSystemDictionaries]=useState([]);
    // 影响公司字典
    const [impact_business_dictionaries,setImpactBusinessDictionaries]=useState([]); 
    // 严重程度字典
    const [severity_dictionaries,setSeverityDictionaries]=useState([]);
    const [editableKeys, setEditableRowKeys] = useState([]);
    const columns = [
        {
            title:'评估项名称',
            dataIndex:'name',
              width: '20%',
              readonly: true,
        },
        {
            title:'可能性',
            dataIndex:'likelihoodScore',
            valueType:'select',
            valueEnum:getValueEnum('likelihoodScore')
        },{
            title:'系统',
            dataIndex:'systemScore',
            valueType:'select',
            valueEnum:getValueEnum('systemScore')
        },{
            title:'用户',
            dataIndex:'userScore',
            valueType:'select',
            valueEnum:getValueEnum('userScore')
        },{
            title:'公司',
            dataIndex:'businessScore',
            valueType:'select',
            valueEnum:getValueEnum('businessScore')
        },{
            title:'严重程度',
            dataIndex:'severity',
            valueType:'select',
            valueEnum:getValueEnum('severity')
        },{
            title:'危害等级',
            dataIndex:'riskRank',
            readonly: true,
            render:(text,record,_,action)=>{
              return <Tag>{computedScore(record)}</Tag>
            }
        },{
            title:'备注',
            dataIndex:'comment',
            
        },
    ]
    useEffect(()=>{
        getDictionaryList();
        getEvaluationList();
        getEvaluation();
    },[])
    function computedScore(record){
      console.log(record)
      const {likelihoodScore,severity,systemScore,userScore,businessScore}=record;
      if(likelihoodScore&&severity){
        let result=likelihoodScore*severity*((systemScore+userScore+businessScore)||1);
        console.log(result,'result')
        return result;
      }
      return '-';

    }
    function getValueEnum(key){
      let dictionary=[];
      if(key==='likelihoodScore') dictionary=likelihood_dictionaries;
      else if(key==='systemScore') dictionary=impact_system_dictionaries;
      else if(key==='userScore') dictionary=impact_user_dictionaries;
      else if(key==='businessScore') dictionary=impact_business_dictionaries;
      else if(key==='severity') dictionary=severity_dictionaries;
      // console.log(dictionary,'****');
      let valueEnum={};
      for(let item of dictionary){
        Object.assign(valueEnum,{
          [item.label]:{
            text:item.label,
            status:item.rank
          }
        })
      }
      // console.log(valueEnum,'!!!!')
      return valueEnum
    }
    function getEvaluationList(){

    }
    function getDictionaryList(){
        let data=['impact_business_dictionaries','impact_system_dictionaries','impact_user_dictionaries','risk_classification_dictionaries','likelihood_dictionaries','severity_dictionaries']
        getDictionary(data).then((res)=>{
            if(res.code==200){
                setImpactUserDictionaries(res.data?.impact_user_dictionaries);
                setImpactBusinessDictionaries(res.data?.impact_business_dictionaries); 
                setLikelihoodDictionaries(res.data?.likelihood_dictionaries);
                setImpactSystemDictionaries(res.data?.impact_system_dictionaries);
                setRiskClassificationDictionaries(res.data?.risk_classification_dictionaries);
                setSeverityDictionaries(res.data?.severity_dictionaries);
            }

        })
    }
    function getEvaluation(){
        getEvaluationItem().then((res)=>{  
            setItem(res.data)
            // 设置可编辑行的 keys
            const editableKeys = res.data.map((item) => item.id);
            setEditableRowKeys(editableKeys)
        })
    }
    function setDataSource(){
        
    }
    return (
        <div>
            <EditableProTable
                // style={{height:'70vh'}}
                recordCreatorProps={false}
                expandable={{defaultExpandAllRows:true}}
                scroll={{x:960,y:460}}
                rowKey="id"
                headerTitle="可编辑表格"
                columns={columns}
                value={item}
                onChange={setDataSource}
                controlled 

                  toolBarRender={() => {
                    return [
                      <Button
                        type="primary"
                        key="save"
                        onClick={() => {
                          // dataSource 就是当前数据，可以调用 api 将其保存
                          console.log(item);
                        }}
                      >
                        保存数据
                      </Button>,
                      <Button
                        key='export'
                      >
                        导出结果
                      </Button>
                    ];
                  }}
                  editable={{
                    type: 'multiple',
                    editableKeys,
                    actionRender: (row, config, defaultDoms) => {
                      return [defaultDoms.delete];
                    },
                    onValuesChange: (record, recordList) => {
                      console.log(record,'record')
                      setDataSource(recordList);

                    },
                    onChange: setEditableRowKeys,
                  }}
            >

            </EditableProTable>
        </div>
        
    )
}
export default EvaluationPage