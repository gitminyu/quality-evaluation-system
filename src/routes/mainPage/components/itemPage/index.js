import { Card, Form,Button ,Input, Divider} from "antd"
import { getEvaluationItem } from "../../../../api"
import {useState,useEffect} from "react"
import {
    EditableProTable,
    ProCard,
    ProFormField,
    useRefFunction,
  } from '@ant-design/pro-components';
import './index.css'
function ItemPage() {
    const [item,setItem]=useState([])
    const [editableKeys, setEditableRowKeys] = useState([]);
    const columns = [
        {
            title:'评估项名称',
            dataIndex:'name',
            formItemProps: (form, { rowIndex }) => {
                return {
                  rules:
                    rowIndex > 2 ? [{ required: true, message: '此项为必填项' }] : [],
                };
              },
              width: '30%',
        },
        {
            title:'释义',
            dataIndex:'paraphrase'
        }
    ]
    useEffect(()=>{
        getEvaluation()
    },[])
    function getEvaluation(){
        getEvaluationItem().then((res)=>{
            
            setItem(res.data)
        })
    }
    function setDataSource(){

    }
    return (
        <div >
            <div>
                <EditableProTable
                expandable={{defaultExpandAllRows:true}}
                scroll={{x:960}}
                rowKey="id"
                headerTitle="可编辑表格"
                columns={columns}
                value={item}
                onChange={setDataSource}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                      console.log(rowKey, data, row);
                    //   await waitTime(2000);
                    },
                    onChange: setEditableRowKeys,
                  }}
            ></EditableProTable>
            </div>
            
        </div>
        
    )
}
export default ItemPage