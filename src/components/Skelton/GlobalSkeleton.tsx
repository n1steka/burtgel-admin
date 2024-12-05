import React from "react";
import { Skeleton } from "antd";

interface GlobalSkeletonProps {
  loading?: boolean;
  active?: boolean;
  rows?: number;
  titleWidth?: string | number;
}

const GlobalSkeleton: React.FC<GlobalSkeletonProps> = ({
  loading = true,
  active = true,
  rows = 4,
  titleWidth = "60%",
}) => {
  return (
    <>
      {loading && (
        <Skeleton
          active={active}
          paragraph={{ rows }}
          title={{ width: titleWidth }}
        />
      )}
    </>
  );
};

export default GlobalSkeleton;
