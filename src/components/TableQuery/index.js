import React, { Fragment, memo, useState, useEffect, useRef } from 'react';
import './index.css';
import PropTypes from 'prop-types';
import RcResizeObserver from 'rc-resize-observer';
import {
	UpCircleOutlined, DownCircleOutlined, SwapOutlined, CaretUpOutlined, ExclamationCircleOutlined, PlusOutlined,
	CaretDownOutlined, SettingOutlined, PlusCircleOutlined, MinusCircleOutlined, CloseOutlined
} from '@ant-design/icons';
import {
	Button, Row, Col, Divider, List, Select, Form, Input, Tooltip, Modal, Popover, message, Spin, InputNumber,
	DatePicker, TimePicker,
	Space
} from 'antd';
import FieldLabel from './components/FieldLabel';
// import emptyImg from '../../images/empty_state_pg.png'
import emptyImg from '../../assets/img/empty_state_pg.png'
// import { callApi, fetchApi } from 'utils';
import moment from 'moment';
// import FieldEdit from 'components/FormManagementV2/components/FieldEdit';

const noop = () => { };

const prefixCls = 'eh-table-query';

// 筛选区域宽度 ≤ 940 px，2列
// 筛选区域宽度 ≤ 1272 px，3列
// 筛选区域宽度 > 1272 px，4列
const DEFAULT_BREAKPOINTS = [
	[940, 2],
	[1272, 3],
	[Infinity, 4],
];
/**
 * 数字范围组件
 */
const NumberSection = ({ value = [], onChange, disabled = false }) => {
	const triggerChange = (changedValue) => {
		onChange?.(changedValue);
	};
	const onNumberChage = (val, index) => {
		let numArr = value;
		if (numArr.length) {
			numArr[index] = val;
		} else {
			numArr = index === 1 ? ['', val] : [val, '']
		}
		triggerChange(numArr);
	}
	return (
		<div className='section'>
			<InputNumber placeholder="请输入"
				disabled={disabled}
				value={value[0] || 0}
				max={value[0]}
				onChange={val => onNumberChage(val, 0)}
			/> ~
			<InputNumber placeholder="请输入"
				style={{ float: 'right' }}
				disabled={disabled}
				min={value[0] || 0}
				value={value[1] || 0}
				onChange={val => onNumberChage(val, 1)}
			/>
		</div>
	)
}
/**
 * 表格查询组件
 * @param {object} props
 */
const defaultCon = () => ({ fieldLabel: '', filterType: '', value: '' });
const TableQuery = props => {
	const [form] = Form.useForm();
	const [modalForm] = Form.useForm();
	const { span, queryItems, onReset, onSubmit, breakPoints, hideBorderBottom, isOpenAdvanced, projectId, formOriginId, organizationId, moduleId, moduleType,
		formFields: searchFormFields } = props;

	const [showAll, setShowAll] = useState(false);
	// 不使用的变量，用于resize时触发FieldLabel更新
	const [containerWidth, setContainerWidth] = useState(0);

	const [autoSpan, setAutoSpan] = useState(() => {
		return 24 / breakPoints[0][1];
	});
	// const [isNormal,setIsNormal] = useState(true);//高級查询或者普通查询
	const [templateVisible, setTemplateVisible] = useState(false);//模板列表是否显示
	const [managementVisible, setManagementVisible] = useState(false);//模板管理弹框
	const [moreVisible, setMoreVisible] = useState(false);//是否展开查询条件
	const [conditions, setConditions] = useState([...[defaultCon()], ...[defaultCon()]]);
	const [detailList, setDetailList] = useState([...[defaultCon()], ...[defaultCon()]]);//模板详情列表
	const [activeIndex, setActiveIndex] = useState(null);//管理中的模板index
	const [listIndex, setListIndex] = useState(null);//列表中的模板index
	const [isDetailView, setIsDetailView] = useState(true);//是否详情查看
	const [addVisible, setAddVisible] = useState(false);//添加模板名称弹框
	const [formFields, setFormFields] = useState([]);//可查询的字段列表
	const [logical, setLogical] = useState('AND');
	const [nameError, setNameError] = useState(0);//0不显示 1 未填写 2 名称已存在
	const templateName = useRef();
	const [templateData, setTemplateData] = useState([]);//下拉模板列表
	const [manTemplateData, setManTemplateData] = useState([]);//管理弹框中的模板列表，可进行添加模板实时显示
	const [tempDetail, setTempDetail] = useState({});
	const [modalLoading, setModalLoading] = useState(true);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!isOpenAdvanced) return;
		// initCondition();
		// getTemplateList();
		// initFormFields();
	}, [searchFormFields.length]);

	useEffect(() => {
		if (!isOpenAdvanced) return;
		// initCondition();
		// getTemplateList();
		// setTemplateVisible(false);
	}, [projectId]);

	useEffect(() => {
		// if (!isOpenAdvanced) return;
		// const list = [...detailList];
		// list.map(it => {
		// 	if (it.fieldType === 'CHECKBOX' || it.fieldType === 'RADIO') {
		// 		if ((managementVisible && isDetailView) || it.status === 1 || it.fieldLabel === '') {
		// 			it.field.readonly = 1;//多选或者单选用表单字段中的readonly来控制是否可用
		// 		} else {
		// 			it.field.readonly = 0;
		// 		}
		// 	}
		// 	return it;
		// })
		// setDetailList(list);
	}, [isDetailView]);

	useEffect(() => {
		// if(!isNormal && !managementVisible){
		// 	getTemplateList();
		// }
		// if (!isOpenAdvanced) return;
		// if (managementVisible) {
		// 	setTemplateVisible(!templateVisible);
		// 	setManTemplateData(templateData);//重置模板列表
		// 	if (activeIndex === null && templateData.length) {
		// 		setActiveIndex(0);
		// 		getTemplateDetail(templateData[0], 0);
		// 	} else if (activeIndex !== null && templateData.length) {
		// 		// setModalLoading(false);
		// 		templateData[activeIndex].id && getTemplateDetail(templateData[activeIndex], activeIndex);
		// 	} else {
		// 		setModalLoading(false);
		// 	}
		// 	setNameError(0);
		// } else {
		// 	if (listIndex || listIndex === 0) {
		// 		getTemplateDetail(templateData[listIndex], listIndex);
		// 	} else {
		// 		setLogical('AND');
		// 	}
		// }
	}, [managementVisible]);

	//初始化字段列表，筛选出可进行查询的字段
	const initFormFields = () => {
		const list = searchFormFields.filter(item => {
			let { fieldExtra } = item;
			fieldExtra = JSON.parse(fieldExtra);
			if (fieldExtra.filterFlag === 1) return item;
			return;
		});
		setFormFields(list);
	}
	/**
	 * 计算并设置autoSpan的值
	 * @param {number} width 容器宽度
	 */
	function setSpan(width) {
		const breakPoint = breakPoints.find(it => it[0] >= width);
		if (breakPoint) {
			setAutoSpan(24 / breakPoint[1]);
		}
	}

	/**
	 * 切换全部显示
	 */
	function onToggle() {
		setShowAll(!showAll);
	}

	/**
	 * 尺寸变化回调
	 */
	function onResize({ width }) {
		setSpan(width);
		setContainerWidth(width);
	}

	/**
	 * 生成 field item
	 */
	let currentWidth = 0;

	function genItems({ key, label, node, isDoubleWidth = false }) {
		currentWidth = currentWidth + (span !== void 0 ? span : autoSpan) * (isDoubleWidth ? 2 : 1);
		const hide = !showAll && currentWidth > 24;
		return <Col className={`${prefixCls}-item-wrapper ${hide ? prefixCls + '-hidden' : ''}`} key={key || label} span={(span === void 0 ? autoSpan : span) * (isDoubleWidth ? 2 : 1)}>
			<div className={`${prefixCls}-item-label`}>{typeof label === 'string' ? <FieldLabel>{label}</FieldLabel> : label}</div>
			<div className={`${prefixCls}-item-field`}>{node}</div>
		</Col>;
	}

	// 监听回车键
	function onKeyUp(e) {
		if (e.key === 'Enter') {
			if (typeof props.onPressEnter === 'function') {
				props.onPressEnter(e);
			} else if (typeof props.onSubmit === 'function' || typeof props.onAdvancedSearch === 'function') {
				if (!isOpenAdvanced) {
					props.onSubmit(e);
				} else {
					props.onAdvancedSearch(
						{ advanceFlag: 1, advanceConditions: { logical, conditionsGroupList: conditions } }
					)
				}
			}
		}
	}

	// 是否应该隐藏折叠按钮
	let sumSpan = 0;
	queryItems.forEach(item => {
		sumSpan = sumSpan + (span !== void 0 ? span : autoSpan) * (item.isDoubleWidth ? 2 : 1);
	});
	const hideCollapseBtn = sumSpan <= 24;

	//获取模板列表 isGetDetail是否需要查询第一个模板详情
	// const getTemplateList = (isGetDetail) => {
	// 	fetchApi({
	// 		api: '/evh/admin/advanceSearch/queryConditionList',
	// 		data: {
	// 			organizationId: organizationId,
	// 			moduleId: moduleId,
	// 			moduleType: moduleType,
	// 			projectId: projectId,
	// 			ownerId: organizationId,
	// 			formOriginId: formOriginId,
	// 			ownerType: 'EhOrganizations',
	// 			projectType: 'EhCommunities'
	// 		},
	// 		success: ({ resultList = [] }) => {
	// 			setTemplateData(resultList);
	// 			setManTemplateData(resultList);
	// 			if (isGetDetail && resultList.length) {
	// 				setActiveIndex(0)
	// 				getTemplateDetail(resultList[0], 0);
	// 			}
	// 		},
	// 		error: ({ errorDescription }) => {
	// 			message.error(errorDescription);
	// 		}
	// 	})
	// }

	//选择字段类型改变
	const handelFieldChange = (val, item, index) => {
		const field = formFields.filter(it => val === it.globalIdentityId)[0];
		const { fieldName, globalIdentityId, fieldType } = field;
		getTypeList(field.fieldType);
		let list = managementVisible ? [...detailList] : [...conditions];
		item.fieldLabel = fieldName;
		item.globaleId = globalIdentityId;
		item.fieldType = fieldType;
		item.logical = logical;
		item.field = field;
		item.field.readonly = 0;
		item.status = 0;
		item.value = '';
		//字段类型变化时清空动态表单单选或者多选选中的数据
		if (item.fieldType === 'CHECKBOX' || item.fieldType === 'RADIO') {
			item.field.fieldValue = '';
		}
		list.splice(index, 1, item)
		if (managementVisible) {
			setDetailList(list);
		} else {
			setConditions(list);
		}
	}

	//选择判断类型改变
	const handelTypeChange = (val, item, index) => {
		let list = managementVisible ? [...detailList] : [...conditions];
		item.filterType = val;
		item.value = '';
		//判断类型变化时清空动态表单单选或者多选选中的数据
		if (item.fieldType === 'CHECKBOX' || item.fieldType === 'RADIO') {
			item.field.fieldValue = '';
		}
		list.splice(index, 1, item)
		if (managementVisible) {
			setDetailList(list);
		} else {
			setConditions(list);
		}
	}
	//条件内容改变
	const handelChangeText = (value, item, index) => {
		let val;
		if (typeof (value) === 'string' || typeof (value) === 'number') {//时间戳或者单个数字
			val = value ? value : '';
		} else {
			val = value ? JSON.stringify(value) : '';
		}
		item.value = val;
		// const currentItem=validate(e.target.value, 2 ,item);
		let list = managementVisible ? [...detailList] : [...conditions];
		list.splice(index, 1, item);
		if (managementVisible) {
			setDetailList(list);
		} else {
			setConditions(list);
		}
	}
	//根据不通字段获取不用判断类型列表
	const getTypeList = (fieldType) => {
		if (fieldType) {
			const defaultList = [
				{ label: '等于（=）', value: 'EQUAL' },
				{ label: '不等于（≠）', value: 'NOTEQUAL' },
				{ label: '为空', value: 'EMPTY' },
				{ label: '不为空', value: 'NOTEMPTY' },
			];
			let list = [], typeList = [];
			switch (fieldType) {
				case 'DATE':
				case 'TIME':
					typeList = [
						{ label: '区间', value: 'SECTION' },
					]
					list = [...defaultList, ...typeList];
					break;
				case 'NUMBER':
					typeList = [
						{ label: '区间', value: 'SECTION' },
						{ label: '大于（＞）', value: 'GREATER' },
						{ label: '大于等于（≥）', value: 'NOTLESS' },
						{ label: '小于（＜）', value: 'LESS' },
						{ label: '小于等于（≤）', value: 'NOTGREATER' },
					]
					list = [...defaultList, ...typeList];
					break;
				case 'RADIO':
					list = [...defaultList];
					break;
				case 'CHECKBOX':
				case 'SINGLE_LINE_TEXT':
				case 'MULTI_LINE_TEXT':
					typeList = [
						{ label: '包含', value: 'INCLUDE' },
						{ label: '不包含', value: 'NOEINCLUDE' },
					]
					list = [...defaultList, ...typeList];
					break;
			}
			// setTypeList(list);
			return list;
		}
		return [];

	}

	//获取至于显示内容
	const getValueItem = (item, index) => {
		const { fieldType, filterType, globaleId } = item;
		let str = '';
		if (filterType === 'EMPTY' || filterType === 'NOTEMPTY') {
			str = <Input disabled />;
			return str;
		}
		const field = searchFormFields.filter(it => it.fieldType === fieldType)[0] || {};
		const { fieldExtra = '{}' } = field;
		switch (fieldType) {
			case 'DATE':
				const { formatType = 0 } = JSON.parse(fieldExtra);
				let format = 'YYYY-MM-DD';//动态表单设置时会选择不同的时间模式
				switch (formatType) {
					case '0':
						format = 'YYYY-MM-DD';
						break;
					case '1':
						format = 'YYYY-MM-DD HH:mm';
						break;
					case '2':
						format = 'YYYY-MM-DD HH:mm:ss';
						break;
				}
				if (filterType === 'SECTION') {
					const value = item.value !== '' && item.value ? JSON.parse(item.value) : null;
					str = (
						<DatePicker.RangePicker
							format={format}
							disabled={(managementVisible && isDetailView) || item.status === 1}
							value={value ? [moment(value[0]), moment(value[1])] : null}
							onChange={(dateRange) => {
								const val = [moment(dateRange[0].format(format)).valueOf(),
								moment(dateRange[1].format(format)).valueOf()];
								handelChangeText(val, item, index)
							}} />
					)
				} else {
					str = (
						<DatePicker
							format={format}
							disabled={(managementVisible && isDetailView) || item.status === 1}
							value={item.value !== '' && item.value ? moment(item.value) : null}
							onChange={(date) => {
								const val = moment(date.format(format)).valueOf();
								handelChangeText(val, item, index)
							}} />
					)
				}

				break;
			case 'TIME':
				const { formatType: timeFormatType } = JSON.parse(fieldExtra);
				const timeFormat = timeFormatType === 3 ? 'HH:mm' : 'HH:mm:ss';
				if (filterType === 'SECTION') {
					const value = item.value !== '' && item.value ? JSON.parse(item.value) : null;
					str = (
						<TimePicker.RangePicker
							format={timeFormat}
							disabled={(managementVisible && isDetailView) || item.status === 1}
							value={value ? [moment(value[0], timeFormat), moment(value[1], timeFormat)] : null}
							onChange={(timeRange) => {
								const val = [timeRange[0].format(timeFormat),
								timeRange[1].format(timeFormat)];
								handelChangeText(val, item, index)
							}} />
					)
				} else {
					str = (
						<TimePicker
							format={timeFormat}
							disabled={(managementVisible && isDetailView) || item.status === 1}
							value={item.value !== '' && item.value ? moment(item.value, timeFormat) : null}
							onChange={(time) => {
								const val = time.format(timeFormat);
								handelChangeText(val, item, index)
							}} />
					)
				}
				break;
			case 'NUMBER':
				if (filterType === 'SECTION') {
					str = <NumberSection
						disabled={(managementVisible && isDetailView) || item.status === 1}
						value={item.value ? JSON.parse(item.value) : []} onChange={val => handelChangeText(val, item, index)}
					/>
				} else {
					str = (
						<InputNumber placeholder="请输入"
							disabled={(managementVisible && isDetailView) || item.status === 1}
							value={item.value}
							onChange={(val) => handelChangeText(val, item, index)}
						/>
					)
				}
				break;
			case 'RADIO':
			case 'CHECKBOX'://多选或者单选取动态表单中设置的数据
				// str = (
				// 	<FieldEdit
				// 		form={{}} communityId={projectId}
				// 		popupContainer={document.body}
				// 		formFields={item.field ? [item.field] : []} changeFormFields={data => changeFormFields(item, data, index)}
				// 	/>
				// )
				break;
			case 'SINGLE_LINE_TEXT':
			case 'MULTI_LINE_TEXT':
			default:
				str = (
					<Input placeholder="关键字之间英文逗号分隔"
						disabled={(managementVisible && isDetailView) || item.status === 1 || item.fieldLabel === ''}
						value={item.value}
						onChange={(e) => handelChangeText(e.target.value, item, index)}
					/>
				)
		}
		return str;
	}

	const changeFormFields = (item, data, index) => {
		const { fieldValue, fieldType } = data[0];
		item.field = data[0];
		if (fieldType === 'CHECKBOX') {//多选
			const { selected = [] } = JSON.parse(fieldValue);
			const arr = selected.map(it => it.value);
			const textArr = selected.map(it => it.text);
			item.value = JSON.stringify(arr);
			item.name = JSON.stringify(textArr);
		} else {//单选
			const { text, value } = JSON.parse(fieldValue);
			item.value = value;
			item.name = text;
		}
		item.status = 0;
		let list = managementVisible ? [...detailList] : [...conditions];
		list.splice(index, 1, item);
		if (managementVisible) {
			setDetailList(list);
		} else {
			setConditions(list);
		}
	}

	//添加查询条件
	const handelAdd = index => {
		let list = managementVisible ? [...detailList] : [...conditions];
		if (index || index === 0) {
			list.splice(index + 1, 0, defaultCon());
			const renderObj = renderForm(list);
			const { newList, defalueVal } = renderObj;
			if (!managementVisible) {
				setConditions(list);
				form.setFieldsValue(defalueVal);
			} else {
				setDetailList(list);
				modalForm.setFieldsValue(defalueVal);
			}
		} else {
			list.push(defaultCon());
			const renderObj = renderForm(list);
			const { newList, defalueVal } = renderObj;
			if (!managementVisible) {
				setConditions(list);
				form.setFieldsValue(defalueVal);
			} else {
				setDetailList(list);
				modalForm.setFieldsValue(defalueVal);
			}
		}
	}
	//删除查询条件
	const handelDelete = index => {
		let list = managementVisible ? [...detailList] : [...conditions];
		list.splice(index, 1);
		const renderObj = renderForm(list);
		const { newList, defalueVal } = renderObj;
		if (!managementVisible) {
			setConditions(list);
			form.setFieldsValue(defalueVal);
		} else {
			setDetailList(list);
			modalForm.setFieldsValue(defalueVal);
		}
		if (!list.length) {
			if (!managementVisible) {
				setConditions([...[defaultCon()]]);
				form.resetFields();
			} else {
				setDetailList([...[defaultCon()]]);
				modalForm.resetFields();
			}
			// message.warning('最少存在一条查询条件！')
		}
	}

	//弹框取消
	const handleModalCancel = () => {
		setManagementVisible(false);
		setNameError(0);
		setActiveIndex(null);
		setIsDetailView(true);
		setModalLoading(false);
	}

	//查询条件显示
	const getRowItem = (item, index) => {
		//status: 0-查询条件正常 1-该行查询条件字段类型有误 2-该行查询条件值域有误
		return (
			<Form.Item key={index} name={index}>
				<Row gutter={8}>
					<Col span={6} className="gutter-row">
						<Form.Item
							name={`fieldLabel${index}`}
							// validateStatus={item.validateStatus ? item.validateStatus[0] :''}
							validateStatus={item.status === 1 ? 'error' : ''}
							help={null}
						>
							<Select value={item.globaleId} placeholder='选择查询条件' onChange={(val) => handelFieldChange(val, item, index)} disabled={managementVisible && isDetailView}>
								{/* {
									formFields.map(item => (
										<Option value={item.globalIdentityId}>{item.fieldName}</Option>
									))
								} */}
							</Select>
						</Form.Item>
					</Col>

					<Col span={6} className="gutter-row">
						<Form.Item
							name={`filterType${index}`}
							// validateStatus={item.validateStatus ? item.validateStatus[1] :''}
							help={null}
						>
							{/* <Select value={item.filterType} placeholder='请选择规则' onChange={val => handelTypeChange(val, item, index)} disabled={(managementVisible && isDetailView) || item.status === 1 || item.fieldLabel === ''}>
								{
									getTypeList(item.fieldType).map(item => (<Option value={item.value}>{item.label}</Option>))
								}
							</Select> */}
						</Form.Item>
					</Col>
					<Col span={12} className="gutter-row valueItem" >
						<Form.Item
							validateStatus={item.status === 2 ? 'error' : ''}
							help={null}
							name={`value${index}`}
						>
							{getValueItem(item, index)}
							<div className='action-opera'
								style={(!isDetailView && managementVisible) || !managementVisible ? { display: 'inline-block' } : { display: 'none' }}>
								<PlusCircleOutlined onClick={() => handelAdd(index)} />
								<MinusCircleOutlined onClick={() => handelDelete(index)} />
								{
									item.status ? (
										<Tooltip title={item.status === 1 ? '字段类型存在异常，请重新选择' : '值域选项存在异常，请重新选择'}>
											<ExclamationCircleOutlined />
										</Tooltip>
									) : null
								}
							</div>
						</Form.Item>
					</Col>
				</Row>
			</Form.Item>
		)
	}

	//渲染form表单数据
	const renderForm = conditionsGroupList => {
		let defalueVal = {}
		const newList = conditionsGroupList.length ? conditionsGroupList.map((item, index) => {
			const obj = item.status || item.status === 0 ? {
				[`fieldLabel${index}`]: item.status !== 1 ? formFields.filter(it => it.globalIdentityId === item.globaleId)[0].fieldName : undefined,
				[`filterType${index}`]: item.filterType || undefined,
				[`value${index}`]: item.status !== 2 ? item.value : '',
			} : {
				[`fieldLabel${index}`]: undefined,
				[`filterType${index}`]: undefined,
				[`value${index}`]: undefined
			}
			defalueVal = {
				...defalueVal,
				...obj
			}
			if (item.fieldType === 'CHECKBOX') {
				let field = formFields.filter(it => it.globalIdentityId === item.globaleId)[0];
				// const keyList = item.key ? JSON.parse(item.key) : JSON.parse(item.value);
				const selected = item.value && item.value !== '' ? JSON.parse(item.value).map((val, index) => ({ value: val, text: item.name ? JSON.parse(item.name)[index] : null })) : [];
				field.fieldValue = item.status !== 2 ? JSON.stringify({ selected }) : '';
				item.field = { ...field };
				if ((managementVisible && isDetailView) || item.status === 1 || item.fieldLabel === '') {
					item.field.readonly = 1;
				} else {
					item.field.readonly = 0;
				}
			}
			if (item.fieldType === 'RADIO') {
				let field = formFields.filter(it => it.globalIdentityId === item.globaleId)[0];
				const { optionsConfig = '', optionsConfig2 = '' } = JSON.parse(field.fieldExtra) || {};
				if (optionsConfig === 'region') {//省市区单独处理
					const regions = item.value.split(',').map(it => Number(it));
					field.fieldValue = item.status !== 2 ? JSON.stringify({ regions }) : '';
				} else if (optionsConfig === 'cascade') {//自定义级联单独处理
					field.fieldValue = item.status !== 2 ? JSON.stringify({ text: item.value }) : '';
				} else if (optionsConfig === 'selectDepartment') {//单选部门单独处理
					if (optionsConfig2 === 'myDepartmentOnly') {
						field.fieldValue = item.status !== 2 ? JSON.stringify({ text: item.name, value: item.value }) : '';
					} else {
						field.fieldValue = item.status !== 2 ? JSON.stringify({ text: item.name, value: item.value }) : '';
					}
				} else {
					field.fieldValue = item.status !== 2 ? JSON.stringify({ value: item.value }) : '';
				}
				item.field = { ...field };


				if ((managementVisible && isDetailView) || item.status === 1 || item.fieldLabel === '') {
					item.field.readonly = 1;
				} else {
					item.field.readonly = 0;
				}
			}
			return item;

		}) : []
		return { newList, defalueVal };
	}

	//查询模板详情
	const getTemplateDetail = (item, index) => {
		// if (managementVisible) {
		// 	setModalLoading(true);
		// } else {
		// 	setLoading(true);
		// }
		// fetchApi({
		// 	api: '/evh/admin/advanceSearch/queryDetail',
		// 	data: {
		// 		id: item.id
		// 	},
		// 	success: (res = {}) => {
		// 		const { advanceConditionsData = {} } = res;
		// 		const { conditionsGroupList = [], logical } = advanceConditionsData;
		// 		const renderObj = renderForm(conditionsGroupList);
		// 		const { newList, defalueVal } = renderObj;
		// 		setLogical(logical);
		// 		if (!managementVisible) {
		// 			setConditions(newList);
		// 			form.resetFields();
		// 			form.setFieldsValue(defalueVal);
		// 			// setLoading(false);
		// 			setListIndex(index);
		// 			handleAdvanceSearch(newList, logical);
		// 			setLoading(false);
		// 		} else {
		// 			setDetailList(newList);
		// 			modalForm.resetFields();
		// 			modalForm.setFieldsValue(defalueVal);
		// 			setTempDetail(res);
		// 			setIsDetailView(true);
		// 			setModalLoading(false);
		// 			setActiveIndex(index);
		// 			setNameError(0);
		// 		}
		// 		// setActiveIndex(index);
		// 	},
		// 	error: ({ errorDescription }) => {
		// 		message.error(errorDescription);
		// 		setLoading(false);
		// 		setModalLoading(false);
		// 	},
		// })
	}
	//删除模板
	const deleteTemplate = () => {
		// Modal.confirm({
		// 	title: '确定删除自定义查询？',
		// 	icon: <ExclamationCircleOutlined />,
		// 	okText: '确认',
		// 	cancelText: '取消',
		// 	centered: true,
		// 	onOk: () => {
		// 		fetchApi({
		// 			api: '/evh/admin/advanceSearch/delete',
		// 			data: {
		// 				id: tempDetail.id
		// 			},
		// 			success: (res = {}) => {
		// 				message.success('删除成功');
		// 				getTemplateList(true);
		// 			},
		// 			error: ({ errorDescription }) => {
		// 				message.error(errorDescription);
		// 			}
		// 		})
		// 	},
		// });

	}
	//初始化查询条件
	const initCondition = () => {
		setNameError(0);
		setAddVisible(false);
		setActiveIndex(null);
		setListIndex(null);
		if (!managementVisible) {
			// templateName.current.input.value= '';
			setConditions([...[defaultCon()], ...[defaultCon()]]);
			setMoreVisible(false);
			form.resetFields();
		} else {
			setDetailList([...[defaultCon()], ...[defaultCon()]]);
			modalForm.resetFields();
		}
		setLogical('AND');
	}
	const addTemplate = () => {
		if (!templateName.current.input.value || templateName.current.input.value.trim() === '') {
			setNameError(1);
			return false;
		} else if (templateData.filter(it => {
			var regex = new RegExp(it.name, 'i');
			return regex.test(templateName.current.input.value.trim())
		}).length) {
			setNameError(2);
			return false;
		}
		const item = {
			name: templateName.current.input.value,
			id: undefined
		}
		setManTemplateData([...[item], ...manTemplateData]);
		setDetailList([...[defaultCon()], ...[defaultCon()]]);
		setTempDetail({ name: item.name, id: undefined });
		modalForm.resetFields();
		setAddVisible(false);
		templateName.current.input.value = '';
		setActiveIndex(0);
		setIsDetailView(false);
	}
	const handelAddTemp = () => {
		if (!isDetailView && !addVisible) {
			message.warning('请保存自定义设置！');
			setAddVisible(false);
		} else {
			setAddVisible(!addVisible);
		}
		setNameError(0);
	}
	//保存模板
	const saveTemplate = (type) => {
		// if (managementVisible) {
		// 	setModalLoading(true);
		// } else {
		// 	setLoading(true);
		// }
		// if (type === 'edit') {
		// 	if (tempDetail.name.trim() === '') {
		// 		setNameError(1);
		// 		setModalLoading(false);
		// 		return;
		// 	}
		// } else {
		// 	if (!templateName.current.input.value || templateName.current.input.value.trim() === '') {
		// 		setNameError(1);
		// 		setLoading(false);
		// 		return;
		// 	}
		// }

		// if (!type && templateData.length === 100) {
		// 	message.error('最多保存100个自定义查询');
		// 	return;
		// }
		// let conditionsGroupList = managementVisible ? [...detailList] : [...conditions];
		// conditionsGroupList = conditionsGroupList.filter(it => it.fieldLabel !== '' && formFields.filter(item => item.globalIdentityId === it.globaleId).length);
		// if (!conditionsGroupList.length) {
		// 	message.warning('请添加查询条件');
		// 	if (managementVisible) {
		// 		setModalLoading(false);
		// 	} else {
		// 		setLoading(false);
		// 	}
		// 	return false;
		// }
		// const advanceConditionsData = {
		// 	logical,
		// 	conditionsGroupList
		// }
		// fetchApi({
		// 	api: type === 'edit' && tempDetail.id ? '/evh/admin/advanceSearch/update' : '/evh/admin/advanceSearch/save',
		// 	data: {
		// 		id: type === 'edit' ? tempDetail.id : undefined,
		// 		name: type !== 'edit' ? templateName.current.input.value.replace(/\s/g, '') : tempDetail.name.replace(/\s/g, ''),
		// 		formOriginId: formOriginId,
		// 		organizationId: organizationId,
		// 		moduleId: moduleId,
		// 		moduleType: moduleType,
		// 		projectId: projectId,
		// 		ownerId: organizationId,
		// 		ownerType: 'EhOrganizations',
		// 		projectType: 'EhCommunities',
		// 		advanceConditionsData
		// 	},
		// 	success: (res = {}) => {
		// 		message.success('保存成功');
		// 		setAddVisible(false);
		// 		setNameError(0);
		// 		// initCondition();
		// 		// getTemplateList(true);
		// 		if (!managementVisible) {
		// 			templateName.current.input.value = '';
		// 		}
		// 	},
		// 	error: ({ errorDescription, errorCode }) => {
		// 		if (errorCode === 20003) {
		// 			setNameError(2);
		// 		} else {
		// 			message.error(errorDescription);
		// 		}
		// 		setLoading(false);
		// 		setModalLoading(false);
		// 	}
		// })
	}

	//查询关系改变
	const changeLogical = val => {
		setLogical(val);
	}
	//切换查询模式
	// const exchangeType = () => {
	// 	if (!isNormal) {
	// 		Modal.confirm({
	// 			title: '切换默认查询条件时，将清空已填入的过滤条件',
	// 			icon: <ExclamationCircleOutlined />,
	// 			okText: '确认',
	// 			cancelText: '取消',
	// 			centered: true,
	// 			onOk: () => {
	// 				setActiveIndex(null);
	// 				initCondition();
	// 				setIsNormal(true);
	// 			},
	// 		});
	// 	} else {
	// 		setIsNormal(false);
	// 		setActiveIndex(null);
	// 	}
	// }

	//高级查询点击查询
	const handleAdvanceSearch = (list, querylogical) => {
		const conditionsList = !!list ? [...list] : [...conditions];
		if (conditionsList.filter(con => con.fieldLabel === '' && con.filterType === '' && con.filterType === '').length === conditionsList.length) {
			message.warning('请添加查询条件');
			return false;
		}
		const conditionsGroupList = conditionsList.filter(con => {
			//存在条件为空时不进行查询，过滤查询条件
			if (con.fieldLabel !== '' && con.filterType !== '') {
				if (con.filterType === 'EMPTY' || con.filterType === 'NOTEMPTY') {
					return true;
				} else {
					if (con.value && con.value !== '' && con.value !== '[]') {
						return true;
					} else {
						return false;
					}
				}
			} else {
				return false;
			}
		}) || [];
		if (conditionsGroupList.length) {
			props.onAdvancedSearch({ advanceFlag: 1, advanceConditions: { logical: querylogical ? querylogical : logical, conditionsGroupList } })
		}
	}
	//普通查询
	const normalContent = (
		<Fragment>
			{/* {isOpenAdvanced ?  (
				<div className={`${prefixCls}-top`}>
					<span className={`${prefixCls}-top-exchange`} onClick={exchangeType}>切换高级查询<SwapOutlined /></span>
				</div>) :null} */}
			<div className={`${prefixCls}-container`}>
				<div className={`${prefixCls}-items-wrapper`}>
					<RcResizeObserver
						onResize={onResize}
					>
						<Row className={`${prefixCls}-items-wrapper`} type='flex' gutter={16}>
							{queryItems.map(genItems)}
						</Row>
					</RcResizeObserver>
				</div>
				<Divider type='vertical' />
				<div className={`${prefixCls}-btns-wrapper`}>
					<Space>
					<Button onClick={onReset}>重置</Button>
					<Button type='primary' onClick={onSubmit}>查询</Button>
					</Space>
					{!hideCollapseBtn && (showAll
						?
						<div className={`${prefixCls}-btns-wrapper-text`} onClick={onToggle}>
							<span style={{ marginRight: 3 }}>收起</span>
							<UpCircleOutlined className={`${prefixCls}-collapse-btn ${prefixCls}-collapse-btn-open`} />
						</div>
						:
						<div className={`${prefixCls}-btns-wrapper-text`} onClick={onToggle}>
							<span style={{ marginRight: 3 }}>更多</span>
							<DownCircleOutlined style={{ color: '#07A6F0' }} className={`${prefixCls}-collapse-btn`} />
						</div>
					)}
				</div>
			</div>
		</Fragment>
	)
	//高级查询
	const advanceContent = () => {
		const classname = templateVisible ? 'templateActive' : '';
		const showClass = templateVisible ? 'block' : 'none';
		const content = (
			<Spin spinning={loading}>
				<div className={`${prefixCls}-top`}>
					{/* <span className={`${prefixCls}-top-exchange`} onClick={exchangeType}>切换默认查询<SwapOutlined /></span> */}
					<span className={`${prefixCls}-top-custom ${classname}`} onClick={() => setTemplateVisible(!templateVisible)}>
						{
							(listIndex || listIndex === 0) ?
								templateData.filter((item, index) => index === listIndex)[0].name
								: '自定义查询'}
						{templateVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
					</span>
					<div className={`${prefixCls}-top-template-list`} style={{ display: showClass }}>
						<List
							size="small"
							key='queryList'
							footer={<div onClick={() => {
								setActiveIndex(listIndex);
								setManagementVisible(true);
								// setActiveIndex(null);
							}}><SettingOutlined />管理</div>}
							// bordered
							split={false}
							dataSource={templateData}
							renderItem={(item, index) => <List.Item key={`${item.name}-${item.id}`} onClick={() => {
								setTemplateVisible(!templateVisible);
								getTemplateDetail(item, index);
							}}><div>{item.name}</div></List.Item>}
						/>
					</div>

				</div>
				<div className={`${prefixCls}-container ${prefixCls}-advance-container`}>
					<Row style={moreVisible ? { maxHeight: 208 } : { maxHeight: 76 }}>
						<Col span={20} style={moreVisible ? { overflowY: 'auto', maxHeight: 208 } : { overflowY: 'hidden' }}>
							<div className={`${prefixCls}-container-main`}>
								<div className='query-mode' style={conditions.length > 1 ? { display: 'flex' } : { display: 'none' }}>
									<div className='query-mode-top'></div>
									<div className='query-mode-content'>
										<Select defaultValue="AND" value={logical} onChange={val => changeLogical(val)} style={{ width: 80 }} bordered={false}>
											{/* <Option value="AND">AND</Option>
											<Option value="OR">OR</Option> */}
										</Select>
									</div>
									<div className='query-mode-bottom' style={!moreVisible && conditions.length > 2 ? { borderBottom: 0 } : {}}></div>
								</div>
								<div className='query-conditions' style={conditions.length === 1 ? { marginLeft: 100 } : {}}>
									<Form form={form}>
										{
											conditions.length && conditions.map((item, index) => {
												return getRowItem(item, index)
											})
										}
									</Form>

								</div>
							</div>
						</Col>
						<Col span={4}>
							<div className={`${prefixCls}-btns-wrapper`} style={{ paddingLeft: 20 }}>
								<Button type="primary" onClick={() => handleAdvanceSearch()}>查询</Button>
								<Popover
									overlayClassName='addTemPopover'
									placement="bottom"
									visible={!managementVisible && addVisible}
									onVisibleChange={() => { setAddVisible(!addVisible); setNameError(0); }}
									content={popoverContent.content}
									title={popoverContent.title}
									trigger="click">
									<Button>保存</Button>
								</Popover>
								{
									!moreVisible ?
										<DownCircleOutlined onClick={() => { if (conditions.length > 2) { setMoreVisible(true) } }} /> :
										<UpCircleOutlined style={{ color: '#07A6F0' }} onClick={() => setMoreVisible(false)} />
								}
							</div>
						</Col>
					</Row>
					<div className='add-condition'>
						<span onClick={() => handelAdd()} style={{ cursor: 'pointer' }}><PlusCircleOutlined /> 添加条件</span>
					</div>
				</div>
			</Spin>)
		return content;
	}
	//新建模板
	const popoverContent = {
		content: (
			<Fragment>
				<div className='add-template'>
					<Input placeholder='请输入' maxLength={16} ref={templateName} onFocus={() => setNameError(0)} />
					{
						nameError !== 0 ? <span className='error'>{
							nameError === 2 ? '名称已存在' : '请输入自定义查询名称'}</span> : null
					}

				</div>
				<div className='add-footer'>
					{
						managementVisible ?
							<Button type='primary' onClick={addTemplate} style={{ marginRight: 10 }}>确定</Button>
							:
							<Button type='primary' loading={loading} onClick={saveTemplate} style={{ marginRight: 10 }}>保存</Button>
					}
					<Button onClick={() => setAddVisible(false)}>取消</Button>
				</div>
			</Fragment>
		),
		title: (
			<div className='add-title'>
				<span>自定义查询名称</span>
				<CloseOutlined onClick={() => setAddVisible(false)} style={{ float: 'right' }} />
			</div>
		)
	}

	return queryItems.length === 0 && !isOpenAdvanced
		? null
		: <div className={prefixCls + ' ' + (props.className || '') + (hideBorderBottom ? ' hide-border-bottom' : '')} onKeyUp={onKeyUp}>
			{
				!isOpenAdvanced ? normalContent : advanceContent()
			}
			<Modal title="自定义查询管理"
				width={1065}
				height={560}
				visible={managementVisible}
				wrapClassName="tableQueryModal"
				onCancel={handleModalCancel}
				footer={null}>
				<Spin spinning={modalLoading}>
					<div className='conditon-management'>
						<div className='conditon-management-list'>
							<Popover
								overlayClassName='addTemPopover'
								placement="bottom"
								visible={managementVisible && addVisible}
								onVisibleChange={handelAddTemp}
								content={popoverContent.content}
								title={popoverContent.title}
								trigger="click">
								<div className='add'>
									<PlusOutlined style={{ marginRight: 10 }} />
									新建查询
								</div>
							</Popover>
							<ul>
								{
									manTemplateData.map((item, index) => {
										return (
											<li className={index === activeIndex ? 'active' : ''} onClick={() => getTemplateDetail(item, index)}>{item.name}</li>
										)
									})
								}
							</ul>
						</div>
						<div className='conditon-management-content'>
							{manTemplateData.length ? (
								<Fragment>
									<div className='conditon-management-content-title'>
										{
											isDetailView ? (
												<Fragment>
													<span className='template-name'>{tempDetail.name}</span>
													<div className='template-opera'>
														<Button style={{ marginRight: 10 }} onClick={() => setIsDetailView(false)}>编辑</Button>
														<Button danger onClick={deleteTemplate}>删除</Button>
													</div>
												</Fragment>
											) : (
												<Fragment>
													<div className='add-template' style={{ width: 300, display: 'inline-block', padding: 0 }}>
														<Input className='template-name'
															onChange={e => {
																setTempDetail({
																	...tempDetail,
																	name: e.target.value.replace(/\s/g, '')
																});
																setNameError(0)
															}}
															maxLength={16}
															value={tempDetail.name} style={{ width: 260, height: 32, fontSize: 16 }} />
														{nameError !== 0 ? <span className='error'>{
															nameError === 2 ? '名称已存在' : '请输入自定义查询名称'}</span> : null
														}
													</div>

													<div className='template-opera'>
														<Button style={{ marginRight: 10 }} type='primary' onClick={() => saveTemplate('edit')}>保存</Button>
														<Button onClick={() => {
															setManTemplateData(templateData);
															templateData.length ?
																getTemplateDetail(templateData[activeIndex], activeIndex)
																: setModalLoading(false)
														}
														}>取消</Button>
													</div>
												</Fragment>
											)
										}

									</div>
									<div className='conditon-management-content-main'>
										<div>
											<div className='query-mode' style={detailList.length > 1 ? { display: 'flex' } : { display: 'none' }}>
												<div className='query-mode-top'></div>
												<div className='query-mode-content'>
													<Select defaultValue="AND"
														value={logical} style={{ width: 80 }}
														onChange={val => changeLogical(val)}
														bordered={false} disabled={managementVisible && isDetailView}>
														{/* <Option value="AND">AND</Option>
														<Option value="OR">OR</Option> */}
													</Select>
												</div>
												<div className='query-mode-bottom'></div>
											</div>
											<div className='query-conditions' style={detailList.length === 1 ? { marginLeft: 100 } : {}}>
												<Form form={modalForm}>
													{
														detailList.map((item, index) => {
															return getRowItem(item, index)
														})
													}
												</Form>
											</div>
										</div>
									</div>
								</Fragment>) : (
								<div className='content-empty'>
									<div>
										<img src={emptyImg} />
										<div>请在左侧添加自定义查询</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</Spin>
			</Modal>
		</div>;
};

TableQuery.propTypes = {
	span: PropTypes.number, // ?/24
	breakPoints: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)), // 断点设置
	queryItems: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
		node: PropTypes.element,
		key: PropTypes.string,
		isDoubleWidth: PropTypes.bool
	})),
	onReset: PropTypes.func,
	onSubmit: PropTypes.func,
	hideBorderBottom: PropTypes.bool, // 是否隐藏底部分隔线
	onPressEnter: PropTypes.func, // 按下回车的回调
	isOpenAdvanced: PropTypes.bool,//是否开启高级查询
	formFields: PropTypes.array,//表单字段用于高级查询
	formOriginId: PropTypes.number,
	organizationId: PropTypes.number,
	moduleId: PropTypes.number,
	moduleType: PropTypes.string,
	projectId: PropTypes.number,
	onAdvancedSearch: PropTypes.func,//高级查询回调
};

TableQuery.defaultProps = {
	queryItems: [],
	breakPoints: DEFAULT_BREAKPOINTS,
	onReset: noop,
	onSubmit: noop,
	hideBorderBottom: false,
	isOpenAdvanced: false,
	formFields: []
};

export default memo(TableQuery);
