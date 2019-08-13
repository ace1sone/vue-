import React from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Input } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { columns, mapDataToCols } from './table.config';
import TagsDialog from './TagsDialog';

class List extends React.Component {
  state = {
    tagsModal: false,
    id: '',
    searchValue: '',
    current: 1,
    name: '',
    title: '',
  };

  componentDidMount() {
    this.loadTagsList();
  }

  loadTagsList = () => {
    const { dispatch } = this.props;
    this.setState({
      current: 1,
    });
    dispatch({
      type: 'tags/loadTagsList',
      payload: {},
    });
  };

  showTagsList = (id, name) => {
    this.setState({ tagsModal: true, id, name, title: '编辑标签' });
  };

  refreshPage = () => {
    this.loadTagsList();
    this.setState({ tagsModal: false, name: '' });
  };

  getValue = e => {
    const { value } = e.target;
    this.setState({
      searchValue: value,
    });
  };

  propsValue = () => {
    const { dispatch } = this.props;
    const { searchValue, current } = this.state;
    const { tags } = this.props;

    dispatch({
      type: 'tags/loadTagsList',
      payload: {
        current,
        keyword: searchValue,
        size: tags.total,
      },
    });
  };

  changePage = page => {
    this.setState(
      {
        current: page,
      },
      () => {
        this.propsValue();
      }
    );
  };

  render() {
    const { tags } = this.props;
    const { tagsModal, id, current, name, title } = this.state;
    const pagination = {
      current,
      total: tags.total,
      pageSize: 20,
      onChange: this.changePage,
    };
    return (
      <PageHeaderWrapper title="标签管理">
        <Card bordered={false}>
          <div style={{ marginTop: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Input onChange={this.getValue} style={{ width: 288, marginRight: 24 }} placeholder="请输入标签名称" allowClear />
              <Button onClick={this.propsValue} type="primary">
                搜索
              </Button>
            </div>
            <div>
              <Button
                style={{ marginLeft: 'auto' }}
                type="primary"
                icon="plus"
                onClick={() => this.setState({ tagsModal: true, id: '', title: '新建标签', searchValue: '' })}
              >
                新建标签
              </Button>
            </div>
          </div>
          <Table
            pagination={pagination}
            columns={columns({ showTagsList: this.showTagsList })}
            dataSource={mapDataToCols(tags.records || [])}
            align="center"
          />
        </Card>
        <TagsDialog visible={tagsModal} id={id} name={name} title={title} onCancel={this.refreshPage} />
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ tags, loading }) => ({
  tags: tags.data,
  loading: loading.models.tags,
});

export default connect(mapStateToProps)(List);
