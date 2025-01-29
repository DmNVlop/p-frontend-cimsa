import { Spin } from "antd";
import { PropTypes } from "prop-types";

function Loading(props) {
  const { loadingMessage } = props;
  return <Spin size="large" tip={loadingMessage || "Cargando..."} fullscreen />;
}
export default Loading;

Loading.propTypes = {
  loadingMessage: PropTypes.string,
};
