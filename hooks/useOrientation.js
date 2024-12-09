import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

export default function useOrientation() {
    const { width, height } = useWindowDimensions();
    const [isPortrait, setIsPortrait] = useState(height >= width)

    useEffect(() => {
        setIsPortrait(height > width);
      }, [width, height]);
    
    return { isPortrait, isLandscape: !isPortrait }
}