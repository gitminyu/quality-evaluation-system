import { Card, Form, Button, Input, Divider } from "antd"
import { getSystemList, updateSystem, deleteSystemById } from "../../../../api"
import { useState, useEffect, useRef } from "react"
import useCallbackState from "../../../../utils/useCallbackState";
import TableQuery from '../../../../components/TableQuery'
import {
  EditableProTable,
  ProCard,
  ProFormField,
  useRefFunction,
} from '@ant-design/pro-components';
const FormItem = Form.Item;
// import './index.css'
function SystemPage() {
  const [system, setSystem] = useState([])
  const [editableKeys, setEditableRowKeys] = useState([]);
  const formRef = useRef(0)
  const columns = [
    {
      title: '系统名',
      dataIndex: 'name',
      width: '30%',
      renderFormItem: (_, { record }) => {
        return <Input value={record.name}></Input>
      }
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      readonly: true,
    },
    {
      title: '所属公司',
      dataIndex: 'company',
    },
    {
      title: '简介',
      dataIndex: 'brief',
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
            setSystem(system.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ]
  const queryItems = [
    {
      node: <FormItem name="askId" label="咨询单号" labelCol={{ span: 6 }}>
        <Input placeholder="请输入" width={'100%'}></Input>
      </FormItem>
    },

    {
      node: <FormItem name="userName" label="咨询人" labelCol={{ span: 6 }}>
        <Input placeholder="请输入" width={'100%'}></Input>

      </FormItem>
    },
  ]
  useEffect(() => {
    getSystem()
  }, [])
  useEffect(() => {
    console.log('%%%%')
  }, [system])
  function getSystem() {
    const data = {
      creatorId: 1
    }

    getSystemList(data).then((res) => {

      setSystem(res.data)
    })
  }
  function setDataSource() {

  }
  function handleEdit(record) {
    // console.log(formRef.current,'formRef')
    // console.log(system, 'system')
    const data = { ...record, creatorId: 1 }
    updateSystem(data).then((res) => {
      getSystem();
    })
  }
  function handleValuesChange(record) {
    // console.log('change',record)
  }
  function handleDelete(id) {

    deleteSystemById({ id: id }).then((res) => {

    })
  }
  function getNewId() {
    return (Math.random() * 1000000).toFixed(0);
  }
  function handleSearch() {

  }
  function onReset() {

  }
  return (
    <div>
      <Form style={{ marginTop: 20 }} ref={(ref) => { formRef.current = ref }}>
        <TableQuery
          span={6}
          hideBorderBottom={true}
          queryItems={queryItems}
          onSubmit={handleSearch}
          onReset={onReset}
        />
      </Form>
      <EditableProTable
        style={{ minHeight: '60vh' }}
        expandable={{ defaultExpandAllRows: true }}
        scroll={{ x: 960 }}
        rowKey="id"
        headerTitle="可编辑表格"
        columns={columns}
        value={system}
        onChange={setSystem}
        recordCreatorProps={{
          newRecordType: 'system',
          record: () => ({ id: getNewId(), name: '', company: '', brief: '', }),
        }}
        type="multiple"
        controlled

        request={(params, sort, filter) => {
          return {
            data: system,
            //total: defaultData.length,//这里会默认写死表格总数据,不建议在request限定
            success: true,
          }
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          position: ["bottomCenter"],
          size: 'small',
          defaultPageSize: 10
        }}

        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log('onsave', rowKey, data, row)
            handleEdit(data)

          },
          onValuesChange: (row, recordList) => {
            // console.log(row,recordList,'onValuesChang')
            // handleEdit(row)
            handleValuesChange(row)
          },
          onChange: setEditableRowKeys,
        }}
      />

    </div>

  )
}
export default SystemPage