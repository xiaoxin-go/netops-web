<template>
  <div class="cmd">
    <div v-for="(cmd, i) in command.split('\n')"
         :key="i"
         :class="cmdClass(cmd)">
      <span v-for="(str, i) in cmd.split(' ')" :key="i" :class="strClass(str)">
        {{str + ' '}}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {defineProps} from "vue";

defineProps({
  command: {
    type: String,
    default: ''
  },
})

const strClass = (str: string) => {
  if (str.indexOf(".") > 0){
    return "ip"
  }
  if (str == "access-list" || str == "rule"){
    return "access-list"
  }
  if (!isNaN(parseInt(str))){
    return 'port'
  }
  if (str.indexOf("SERVICE") > 0 || str.indexOf("TCP") >= 0 || str.indexOf("UDP") >= 0){
    return "service"
  }
  if (str.indexOf("SRC") > 0){
    return "src"
  }
  if (str.indexOf("DST") > 0){
    return "dst"
  }
  if(str.startsWith("YWJS")){
    return "rule-name"
  }
}
const cmdClass = (cmd: string) =>{
  cmd = cmd.trim()
  const cmdItems = ["network-object", "port-object", "subnet", "action", "source",
    "destination", "security-zone", "move", "service", "network host", "network subnet"]
  for (let v of cmdItems){
    if (cmd.startsWith(v)){
      return "cmd-item"
    }
  }
}

</script>

<style scoped>
.ip{
  color: #52c41a;
}
.port{
  color: #1890ff;
}
.access-list{
  color: #eb2f96;
}
.service{
  color: #df501a;
}
.src{
  color: cornflowerblue;
}
.dst{
  color: #99ea62;
}
.rule-name{
  color: #b74dec;
}
.cmd-item{
  padding-left: 15px;
}
.cmd{
  background-color: rgba(50, 51, 46, 0.87);
  color: white;
  padding: 5px 10px;
}
</style>
