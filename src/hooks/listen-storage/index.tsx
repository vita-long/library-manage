import { tokenManager } from "@/utils/token";
import React from "react";

const useListenStorage = () => {

  React.useEffect(() => {
    const ev = (event: StorageEvent) => {
      if (event.key === tokenManager.getPrefixKey()) {
        if (!event.newValue) {
          // 其他标签页退出登录
          tokenManager.clearToken();
          window.location.reload();
        }
      }
    };
    // 监听 storage 事件实现多标签页同步
    window.addEventListener('storage', ev);
    return () => {
      window.removeEventListener('storage', ev);
    };
  }, []);

};

export {
  useListenStorage
};
