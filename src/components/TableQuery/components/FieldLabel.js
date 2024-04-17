import React, { useRef, useState, useEffect } from 'react';
import { Tooltip } from 'antd';

const prefixCls = 'eh-table-query';

const FieldLabel = (props, ref) => {
	const { children } = props;
	const [ellipsis, setEllipsis] = useState(false);
	const [emCount, setEmCount] = useState(0);
	const spanRef = useRef(null);

	function resize () {
		if (!spanRef.current) {
			return;
		}
		const spanWidth = spanRef.current.getBoundingClientRect().width;
		// 包裹 label 和 input 的元素
		let wrapperNode = spanRef.current.parentNode;
		while (wrapperNode) {
			if (wrapperNode.className.indexOf('eh-table-query-item-wrapper') !== -1) {
				break;
			}
			wrapperNode = wrapperNode.parentNode;
		}
		const inputWidthMin = parseFloat(getComputedStyle(wrapperNode.children[1]).minWidth);
		// 计算label允许的最大宽度
		const labelWidthMax = wrapperNode.getBoundingClientRect().width - inputWidthMin - 24; // 左右padding 8 和 内部 margin 8，加起来24
		const parentFontSize = parseFloat(getComputedStyle(spanRef.current.parentNode).fontSize);
		if (spanWidth > labelWidthMax) {
			setEllipsis(true);
			setEmCount(Math.floor(labelWidthMax / parentFontSize));
		} else {
			setEllipsis(false);
		}
	}

	useEffect(() => {
		resize();
	});

	return ellipsis ? <Tooltip title={children} arrowPointAtCenter>
		<div className={`${prefixCls}-label-wrapper`} style={{width: emCount ? `${emCount}em` : 'auto'}}><span ref={spanRef}>{children}</span></div>
	</Tooltip> : <div className={`${prefixCls}-label-wrapper`}><span ref={spanRef}>{children}</span></div>;
};

export default FieldLabel;
