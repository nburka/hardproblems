import styles from './map.module.scss';

export function Map() {
  return (
    <>
      <p>4th Floor, 1 Rivington Place, London EC2A 3BA</p>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.2855128099854!2d-0.08192342218557233!3d51.52632290931932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761cba884c342b%3A0xe4666be3fe5263b2!2sRivington%20Place%2C%201%20Rivington%20Pl%2C%20London%20EC2A%203BA!5e0!3m2!1sen!2suk!4v1729851120894!5m2!1sen!2suk"
        width="100%"
        height="350"
        loading="lazy"
        className={styles.mapEmbed}
      ></iframe>
    </>
  );
}
