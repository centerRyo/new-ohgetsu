import styles from './index.module.scss';

export const Error500 = () => (
  <div className={styles.root}>
    <p className={styles.text}>ご不便をかけて申し訳ありません。</p>
    <p className={styles.text}>
      正常にご覧いただけるよう、解決に取り組んでいます。
    </p>
  </div>
);
