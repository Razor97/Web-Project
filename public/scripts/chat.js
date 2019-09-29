var flag = 0;
var no_of_windows = 0;
var latest_node;
var isInitialized = false;
var pos = 0;
var offset = 10;
var index = 0;
var space;
var count_of_boxes = 1;
var pos_rec = [0];
var id_box=[0];
var dict = {0:0};

function display(box_id)
{
  if(flag==0)
  {
    document.getElementById("chat_001").style.display = "none";
    document.getElementById("0").style.display = "block";
    flag = 1;
  }
  else {


    if(box_id=="0" && count_of_boxes>1) //destroy all but 0
    {
      for(var i=1;i<count_of_boxes;i++)
      {
        document.getElementById(i.toString()).remove();
      }
      document.getElementById(box_id).style.display="none";
      reset();
      return;
    }

    else if(box_id=="0" && count_of_boxes==1){ //trying to close the main chat box which is the last box{
      document.getElementById(box_id).style.display = "none";
      count_of_boxes--;
      reset();
      return;
    }

    //deleting non_first postion box
    //move all chat boxes ahead if any is there behind the chat box being closed

    if(parseInt(box_id)!=id_box[id_box.length-1]) //check if current box is not the last box
    {


      for(var i = id_box.length-1;id_box[i]>parseInt(box_id);i--)
      {
        //move the boxes back

        document.getElementById(id_box[i].toString()).style.right = dict[id_box[i-1]].toString()+"px";
        dict[id_box[i]] = dict[id_box[i-1]];

      }

      pos = dict[id_box[id_box.length-1]];

      for(var i=0;i<id_box.length;i++)
        {
          if(id_box[i]==parseInt(box_id))
            {
              id_box.splice(i,1);
              break;
            }
        }


      document.getElementById(box_id).remove();


      count_of_boxes--;
      pos_rec.pop();
      return;
    }

    else {
      document.getElementById(box_id).remove();
      count_of_boxes--;
      pos_rec.pop();
      pos = dict[id_box[id_box.length-1]];


      for(var i=0;i<id_box.length;i++)
        {
          if(id_box[i]==parseInt(box_id))
            {
              id_box.splice(i,1);
              break;
            }
        }


      return;
    }

}
}

function reset()
{
  document.getElementById("chat_001").style.display = "block";
  flag = 0;
  pos_rec=[];
  pos_rec.push(0);
  index=0;
  isInitialized = false;
  count_of_boxes = 1;
  dict={0:0};
}



function clone() //getting called when atleast 1 tab is open
{
  if(!isInitialized)
  {
    latest_node = document.getElementById("0");
    space = latest_node.getBoundingClientRect().width;
    isInitialized = true;
    pos = pos_rec.pop(); //starting point
    pos_rec.push(pos);
  }

    var temp = latest_node.cloneNode(true);
    temp.id=(++index).toString();



    pos = pos+parseInt(space)+offset;

    dict[index] = pos;//store key->value pair
    id_box.push(index);
    pos_rec.push(index);
    temp.style.right = (pos).toString()+"px";
    count_of_boxes++;
    document.body.appendChild(temp);

}
