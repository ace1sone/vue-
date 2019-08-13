import React from 'react';
import { Card, Button, List, Badge, Skeleton, Avatar, Select } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { FormattedMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Lightbox from 'react-images';

import styles from './Lists.less';

class Lists extends React.Component {
  state = {
    lightboxIsOpen: false,
    imgs: [],
    currentImage: 0,
    reportedSort: '',
  };
  componentDidMount() {
    this.goToPage(0, 20);
  }

  goToPage = (page, size) => {
    const { dispatch } = this.props;
    const { reportedSort } = this.state;
    dispatch({
      type: 'complaint/search',
      payload: {
        reportedSort,
        status: 2,
        pageBar: {
          pageIndex: page > 0 ? page - 1 : page,
          pageSize: size,
        },
      },
    });
  };

  handleSearch = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'complaint/search',
      payload: {
        ...fields,
        status: 2,
        pageBar: {
          pageIndex: 0,
          pageSize: 20,
        },
      },
    });
  };

  createActionBtn = item => [

    item.reportedStatusEnum.code == "3" ? (
      <span>已{item.reportedStatusEnum.message}用户</span>
    )
      : (<span>已{item.reportedStatusEnum.message}</span>)
  ];

  handleSortChange = val => {
    this.setState({ reportedSort: val });
    this.handleSearch({ reportedSort: val });
  };

  genReason = val => {
    return ['', '拼图', '无关图片', '重复上传', '其它'][val];
  };

  showImg = item => {
    if (!item.multimedias) return;
    let imgs = item.multimedias.map(item => ({ src: item.url }));
    this.setState({
      lightboxIsOpen: true,
      imgs: imgs,
    });
  };

  gotoPrevious = () => {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  };
  gotoNext = () => {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  };
  gotoImage = index => {
    this.setState({
      currentImage: index,
    });
  };

  handleClickImage = () => {
    if (this.state.currentImage === this.state.imgs.length - 1) return;
    this.gotoNext();
  };

  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  };

  render() {
    const { complaint } = this.props;
    const { data, loading } = complaint;
    const { searchReportResults, pageBar } = data;
    const { dataCount = 0, pageIndex = 1, pageSize = 20 } = pageBar || {};
    return (
      <PageHeaderWrapper title="已处理的举报列表">
        <Card>
          <div className={styles.header}>
            <Select
              value={this.state.reportedSort}
              onChange={this.handleSortChange}
              placeholder="请选择排序方式"
            >
              <Select.Option value="">请选择排序方式</Select.Option>
              <Select.Option value="0">时间最新在前</Select.Option>
              <Select.Option value="1">时间最旧在前</Select.Option>
            </Select>{' '}
            <Button type="primary" onClick={() => router.goBack()}>
              <FormattedMessage id="menu.back" />
            </Button>
          </div>
          <List
            itemLayout="horizontal"
            size="large"
            dataSource={searchReportResults}
            pagination={{
              total: dataCount || 0,
              current: pageIndex + 1 || 1,
              showSizeChanger: true,
              onChange: this.goToPage,
              onShowSizeChange: this.goToPage,
              pageSizeOptions: ['20'],
              pageSize: pageSize,
            }}
            bordered
            loading={loading}
            renderItem={item => (
              <List.Item actions={this.createActionBtn(item)}>
                <Skeleton avatar title={false} loading={item.loading} active>
                  <div style={{ flex: 1 }}>
                    <Badge count={item.multimedias ? item.multimedias.length : 0}>
                      <Avatar
                        shape="square"
                        size={64}
                        src={item.mainImage}
                        onClick={() => this.showImg(item)}
                      />
                    </Badge>
                  </div>
                  <div style={{ flex: 9 }}>
                    <p>
                      {item.evaluatorName} {item.reportedAt} 举报：
                    </p>
                    <p>
                      <a onClick={() => router.push(`/eval/users/users/edit/${item.customerId}`)}>
                        {item.customerName}
                      </a>
                      的 {item.evaluationCode} {item.rejectResonTypeEnum.message}
                    </p>
                  </div>
                </Skeleton>
              </List.Item>
            )}
          />
        </Card>
        <Lightbox
          images={this.state.imgs}
          currentImage={this.state.currentImage}
          isOpen={this.state.lightboxIsOpen}
          onClickImage={this.handleClickImage}
          onClickNext={this.gotoNext}
          onClickPrev={this.gotoPrevious}
          onClose={this.closeLightbox}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ complaint }) => ({
  complaint,
}))(Lists);
