import {useState,useCallback} from "react"
import {Tabs, Card} from "@shopify/polaris";

const TabComponent = (props) => {
    const {tabs} = props
    const [selected, setSelected] = useState(0);
  
    const handleTabChange = useCallback(
      (selectedTabIndex) => {
        setSelected(selectedTabIndex)
        props.setPage(tabs[selectedTabIndex].page);
      },
      [],
    );

    return (
      // <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          {tabs[selected].children}
        </Tabs>
      // </Card>
    );
  }

  export default TabComponent;