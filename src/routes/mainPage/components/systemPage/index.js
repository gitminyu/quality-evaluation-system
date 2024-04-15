import { Card, Form,Button ,Input, Divider} from "antd"
import { getSystemList,updateSystem ,deleteSystemById} from "../../../../api"
import {useState,useEffect} from "react"
import useCallbackState from "../../../../utils/useCallbackState";
import {
    EditableProTable,
    ProCard,
    ProFormField,
    useRefFunction,
  } from '@ant-design/pro-components';
// import './index.css'
function SystemPage() {
    const [system,setSystem]=useState([])
    const [editableKeys, setEditableRowKeys] = useState([]);
    const columns = [
        {
            title:'系统名',
            dataIndex:'name',
              width: '30%',
        },
        {
            title:'创建人',
            dataIndex:'creatorName',
            readonly:true,
        },
        {
            title:'所属公司',
            dataIndex:'company',
        },
        {
            title:'简介',
            dataIndex:'brief',
        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => [
              <a
                key="editable"
                onClick={() => {
                    
                  action?.startEditable?.(record.id);
                }}
              >
                编辑
              </a>,
              <a
                key="delete"
                onClick={() => {
                    handleDelete(record.id);
                  setDataSource(system.filter((item) => item.id !== record.id));
                }}
              >
                删除
              </a>,
            ],
          },
    ]
    useEffect(()=>{
        getSystem()
    },[])
    function getSystem(){
        const data={
            creatorId:1
        }
        
        getSystemList(data).then((res)=>{
            
            setSystem(res.data)
        })
    }
    function setDataSource(){

    }
    function handleEdit(record){
      console.log(system,'system')
        updateSystem(record).then((res)=>{
            
        })
    }
    function handleDelete(id){

    }
    function getNewId(){
        return (Math.random() * 1000000).toFixed(0);
    }
    return (
        <div>
            <EditableProTable
                expandable={{defaultExpandAllRows:true}}
                scroll={{x:960}}
                rowKey="id"
                headerTitle="可编辑表格"
                columns={columns}
                value={system}
                onChange={setSystem}
                recordCreatorProps={{
                    // 每次新增的时候需要Key
                    record: () => ({ id: getNewId() }),
                  }}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                      console.log(row,'!!!!');

                        handleEdit(row);
                    //   await waitTime(2000);
                    },
                    onChange: setEditableRowKeys,
                  }}
            ></EditableProTable>
        </div>
        
    )
}
export default SystemPage