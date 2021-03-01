import * as React from 'react';

import { StorageImage, useStorage } from "reactfire"

function EventsInfo(props) {



  const { info } = props;

  const storage = useStorage();


  const ref = info.photoName && storage.ref().child(info.photoName).fullPath;

  console.log({ props, ref })

  const displayName = `${info.name}`;

  return (
    <div>
      <div>
        {displayName} {' '}

        <div>{info.description}</div>

      </div>
      {

        info.photoName && <StorageImage storagePath={ref} width="100" height="100" onError={() => { }} defaultValue="" />

      }
    </div>
  );
}

export default React.memo(EventsInfo);
