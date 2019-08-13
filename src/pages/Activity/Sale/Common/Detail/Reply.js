import React from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Form, Select, Badge, Avatar } from 'antd';

import _ from 'lodash';
import styles from './List.less';
import Lightbox from 'react-images';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Option } = Select;

@connect(({ activity, loading }) => ({
  activity,
  loading: loading.models.activity,
}))
@Form.create()
class Reply extends React.Component {
  state = {
    lightboxIsOpen: false,
    imgs: [],
    currentImage: 0,
  };

  componentDidMount() {
    this.loadContentIds();
  }

  loadContentIds = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (!_.isEmpty(params.id)) {
      dispatch({
        type: 'activity/clientList',
        payload: { activityId: params.id },
      });
    }
  };

  handleSearch = async (current = 1, size = 10) => {
    const {
      form: { getFieldValue },
      dispatch,
      match: { params },
      activity: { replyIds },
    } = this.props;
    const currentId = getFieldValue('dialogId');
    const dialogId = replyIds.filter(item => item.value === _.toNumber(currentId))[0].id;
    const res = await dispatch({
      type: 'activity/clientContent',
      payload: {
        current,
        size,
        activityId: params.id,
        dialogId,
      },
    });
    this.replyContents = res.header.code === 2000 && res.data;
    this.forceUpdate();
  };

  handleClearForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  showImg = item => {
    if (!item.images) return;
    const imgs = item.images.map(eve => ({ src: eve }));
    this.setState({
      lightboxIsOpen: true,
      imgs,
    });
  };

  gotoNext = () => {
    const { currentImage } = this.state;
    this.setState({
      currentImage: currentImage + 1,
    });
  };

  gotoImage = index => {
    this.setState({
      currentImage: index,
    });
  };

  handleClickImage = () => {
    const { imgs, currentImage } = this.state;
    if (currentImage === imgs.length - 1) return;
    this.gotoNext();
  };

  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  };

  render() {
    const {
      activity: { replyIds },
      loading,
      title,
      form: { getFieldDecorator },
    } = this.props;
    const { records, total, current, pages } = this.replyContents || [];
    const columnsList = [
      {
        title: '用户回复ID',
        dataIndex: 'id',
      },
      {
        title: '回复内容',
        dataIndex: 'content',
        render: (content, currentData) => {
          if (!content && currentData.images) {
            return (
              <Badge count={currentData.images ? currentData.images.length : 0}>
                <Avatar shape="square" size={64} src={currentData.images[0]} onClick={() => this.showImg(currentData)} />
              </Badge>
            );
          }
          return <span>{content}</span>;
        },
      },
      {
        title: '用户ID',
        dataIndex: 'userID',
      },
      {
        title: '回复时间',
        dataIndex: 'createdAt',
      },
    ];
    const pagination = {
      onChange: this.handleSearch,
      total,
      current,
      showTotal: t => `${pages}页共${t}条`,
    };

    const { imgs, currentImage, lightboxIsOpen } = this.state;

    return (
      <PageHeaderWrapper title={title}>
        <Card bordered={false}>
          <Form layout="inline" style={{ marginBottom: 24 }}>
            <Form.Item>
              {getFieldDecorator('dialogId', {
                initialValue: '',
              })(
                <Select style={{ width: 200 }} allowClear>
                  <Option value="">请选择内容ID</Option>
                  {replyIds && replyIds.length > 0 && replyIds.map(item => <Option key={item.value}>{item.id}</Option>)}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              <Button className={styles['btn-search']} type="primary" onClick={() => this.handleSearch()}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={this.handleClearForm} type="default">
                清空
              </Button>
            </Form.Item>
          </Form>
          <Table columns={columnsList} dataSource={records || []} pagination={pagination} align="center" loading={loading} rowKey="id" />
          <Lightbox
            images={imgs}
            currentImage={currentImage}
            isOpen={lightboxIsOpen}
            onClickImage={this.handleClickImage}
            onClickNext={this.gotoNext}
            onClickPrev={this.gotoPrevious}
            onClose={this.closeLightbox}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Reply;
