export default function Feed() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/feeds/feed.xml',
      permanent: true,
    },
  };
}

