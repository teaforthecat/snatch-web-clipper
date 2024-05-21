import { useEffect, useReducer } from 'react';
import { NotionClient } from './NotionClient'
import { getSelection } from './webClipper'

function requestStateReducer(state, action) {
  // TODO add constrait on return value to set of states:
  // init, pending, success, error
  switch (action.action) {
  case 'init':
    return 'init'
  case 'gettingTab':
    return 'pending'
  case 'requesting':
    return 'pending'
  case 'response':
    return 'success'
  case 'error':
    return 'error'
  default:
    return 'error'
  }
}

export default function SendSelectedComponent() {

   // init -> pending -> success | error
  const [requestState, requestStateDispatch] = useReducer(requestStateReducer,
                                                          {action: 'init'});

  // returns a Promise
  function sendToNotion(selectedText, tab) {
    // TODO: add data entry feature to store this info in chrome storage
    let options = {
      authToken: "",
      pageId: "",
      databaseId: ""
    };
    const notionClient = new NotionClient(options);
    let selection = {
      selectedText: selectedText,
      sourcePageTitle: tab.title,
      sourceFavicon: tab.favIconUrl,
      sourceUrl: tab.url || "none"
    };
    return notionClient.addNotionPageToDatabase(selection);
  }

  // useEffect because we want this to execute on page load, i.e.: when the
  // extension icon is clicked
  useEffect( async () => {
    let [selectedText, tab] = []
    console.log('pending')
    requestStateDispatch({action: 'gettingTab'});
    try {

      [selectedText, tab] = await getSelection();

    } catch(err) {
      requestStateDispatch({action: 'error', msg: 'could not get selection'})
      console.log('error', err)
    }

    if (selectedText !== undefined) {
      requestStateDispatch({action: 'requesting' });

      sendToNotion(selectedText, tab)
        .then(response => {
          console.log('success', response)
          requestStateDispatch({action: 'response', response: response});
        }).catch(err => {
          console.log('error', err)
          requestStateDispatch({action: 'error', msg: err});
        })
    } else {
      console.log('not sure what to do here yet')
    }
    return () => console.log("goodbye useEffect");

    // empty array turns this into a once only
  }, []);


   return (
      // switch statement didn't work here, but this is not bad
      {
         'init': <div className="init">init</div>,
         'pending': <div className="pending">pending</div>,
         'success': <div className="success">success</div>,
         'error': <div className="error">error</div>
      }[requestState] //|| <div className="error">wut</div>;
   );
}
