import { useEffect, useRef } from "react";
import classes from "./GroupHeader.module.css";

/** Если групп мало, то повторяем элементы в группе несколько раз */
const getCorrectGroups = (groups) => {
  if (groups.length === 0) groups = ["empty"];
  const newGroups = [...groups];
  while (newGroups.length < 10) newGroups.push(...groups);
  return newGroups;
};

/** Получить ссылку на элемент, при появлении которого будут происходить действия */
function useObserver(callback) {
  const element = useRef(null);
  const observer = useRef(null);
  useEffect(() => {
    observer.current = new IntersectionObserver(callback);
    observer.current.observe(element.current);
  }, []);
  return element;
}

/** Нарисовать группу */
function Group({ group, curGroup, setCurGroup }) {
  const ref = useRef(null);

  const onClick = () => {
    ref.current.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: "smooth",
    });
    setCurGroup(group);
  };

  return (
    <div className={classes.group} ref={ref}>
      <button
        className={classes.groupContent}
        style={curGroup === group ? { background: "#5865f2" } : {}}
        onClick={onClick}
      >
        {group.name}
      </button>
    </div>
  );
}

/** Нарисовать список групп */
function GroupList({ groups, curGroup, setCurGroup, addEffect = false }) {
  return (
    <div className={classes.groupList}>
      {groups.map((group) => (
        <Group
          key={group.id}
          group={group}
          curGroup={curGroup}
          setCurGroup={setCurGroup}
          addEffect={addEffect}
        />
      ))}
    </div>
  );
}

/** Группы */
function Groups({ groups = [], curGroup, setCurGroup }) {
  const groupsRef = useRef(getCorrectGroups(groups)); // Корректный список групп
  const start = useRef(null); // Начало (место, куда перемещается скрол при уходе сильно в лево)
  const end = useRef(null); // Конец (место, куда перемещается скрол при уходе сильно в право)

  /** Действия, если пользователь долистал до начала */
  const callbackStart = (entries) => {
    // Если элемент стал виден пользователю
    if (entries[0].isIntersecting) {
      // То пролистываем к элементу в начале
      start.current.scrollIntoView({ block: "start", inline: "start" });
    }
  };

  /** Действия, если пользователь долистал до конца */
  const callbackEnd = (entries) => {
    // Если элемент стал виден пользователю
    if (entries[0].isIntersecting) {
      // То пролистываем к элементу в конце
      end.current.scrollIntoView({ block: "end", inline: "end" });
    }
  };

  const startJumper = useObserver(callbackStart);
  const endJumper = useObserver(callbackEnd);

  return (
    <div className={classes.groups}>
      <div ref={startJumper}>
        <GroupList
          curGroup={curGroup}
          setCurGroup={setCurGroup}
          groups={groupsRef.current}
        />
      </div>
      <GroupList
        curGroup={curGroup}
        setCurGroup={setCurGroup}
        groups={groupsRef.current}
      />
      <div ref={start}></div>
      <GroupList
        curGroup={curGroup}
        setCurGroup={setCurGroup}
        groups={groupsRef.current}
        addEffect={true}
      />
      <div ref={end}></div>
      <GroupList
        curGroup={curGroup}
        setCurGroup={setCurGroup}
        groups={groupsRef.current}
      />
      <div ref={endJumper}>
        <GroupList
          curGroup={curGroup}
          setCurGroup={setCurGroup}
          groups={groupsRef.current}
        />
      </div>
    </div>
  );
}

export default Groups;
