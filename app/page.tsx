"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button, Input, Checkbox, Spacer, Card } from "@nextui-org/react";
import { FaPlusCircle, FaMinusCircle, FaLemon } from "react-icons/fa";
import { BsBrightnessHighFill, BsBrightnessAltHighFill } from "react-icons/bs";

type RepProperties = {
  [key: string]: number | string;
};

interface Item {
  name: string;
  price: number;
  Invs: RepProperties[];
}

interface Person {
  name: string;
  items: Item[];
  total?: RepProperties[];
  hide: boolean;
}

export default function Home() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [targetPerson, setTargetPerson] = useState(0);
  const [visibility, setVisibility] = useState<boolean>(false);
  const invPre = "inv";

  const handlePersonNameChange = (index: number, value: string) => {
    setPersons(prevPersons => {
      const newPersons = [...prevPersons];
      newPersons[index].name = value;
      return newPersons;
    });
  };

  const handleHideChange = (index: number) => {
    setPersons(prevPersons => {
      const newPersons = [...prevPersons];
      newPersons[index].hide = !newPersons[index].hide;
      return newPersons;
    });
  };

  const toggleItemVisibility = () => {
    setVisibility(prevVisibility => {
      const newVisibility = !prevVisibility;
      setPersons(prevPersons =>
        prevPersons.map(person => ({
          ...person,
          hide: newVisibility,
        }))
      );
      return newVisibility;
    });
  };

  const handleItemChange = (
    personIndex: number,
    itemIndex: number,
    field: "name" | "price",
    value: string | number
  ) => {
    setPersons(prevPersons => {
      const newPersons = [...prevPersons];
      if (field === "price") {
        newPersons[personIndex].items[itemIndex][field] = Number(value);
        let amdInvs = [...newPersons[personIndex].items[itemIndex]?.Invs];
        const totalInv = amdInvs.filter((inv, ind) => inv[`${invPre}${ind}`] != 0);
        newPersons[personIndex].items[itemIndex].Invs = handlePrice(
          Number(value),
          totalInv.length,
          amdInvs
        );
      } else {
        newPersons[personIndex].items[itemIndex][field] = value as string;
      }
      return newPersons;
    });
  };

  const handleCheckboxChange = (
    personIndex: number,
    itemIndex: number,
    newvalue: number,
    invIndex: number
  ) => {
    setPersons(prevPersons => {
      const newPersons = [...prevPersons];
      let amdInvs = [...newPersons[personIndex].items[itemIndex]?.Invs];
      const totalInv = amdInvs.filter((inv, ind) => ind != invIndex && inv[`${invPre}${ind}`] != 0);
      let invCount = totalInv.length;
      if (newvalue === 1) invCount++;
      const newprice = newPersons[personIndex].items[itemIndex].price != 0 ? newPersons[personIndex].items[itemIndex].price / invCount : 0;

      if (newprice === 0) {
        amdInvs[invIndex] = { [`${invPre}${invIndex}`]: newvalue === 1 ? newvalue + 0.111 : 0 };
      } else {
        amdInvs = amdInvs.map((n, i) => {
          const inv = `${invPre}${i}`;
          if (newvalue === 0) {
            if (i === invIndex) return { [inv]: 0 };
            else if (n[inv] !== 0 && n[inv] !== 0.111) return { [inv]: newprice.toFixed(2) };
          } else {
            return { [inv]: newprice.toFixed(2) };
          }
          return n;
        });
      }
      newPersons[personIndex].items[itemIndex].Invs = amdInvs;
      return newPersons;
    });
  };

  const handlePrice = (
    value: number,
    invCount: number,
    amdInvs: RepProperties[]
  ) => {
    const newprice = value !== 0 ? value / invCount : 0;
    if (newprice !== 0) {
      amdInvs = amdInvs.map((n, i) => {
        const inv = `${invPre}${i}`;
        if (n[inv] !== 0) return { [inv]: newprice.toFixed(2) };
        else return { [inv]: 0 };
      });
    }
    return amdInvs;
  };

  const addPerson = () => {
    if (targetPerson > 0) {
      const newPersons = Array.from({ length: targetPerson }, () => ({
        name: "",
        hide: false,
        items: [getSub()],
      }));
      setPersons(newPersons);
    }
  };

  const getSub = (): Item => {
    const newSub: Item = { name: "", price: 0, Invs: [] };
    for (let i = 0; i < targetPerson; i++) {
      newSub.Invs.push({ [`${invPre}${i}`]: 1.111 });
    }
    return newSub;
  };

  const addItem = (personIndex: number) => {
    setPersons(prevPersons => {
      const newPersons = [...prevPersons];
      newPersons[personIndex].items.push(getSub());
      return newPersons;
    });
  };

  const removeItem = (personIndex: number) => {
    setPersons(prevPersons => {
      const newPersons = [...prevPersons];
      if (newPersons[personIndex].items.length > 1) {
        newPersons[personIndex].items.pop();
      }
      return newPersons;
    });
  };

  const calculateTotalPrice = (person: Person) => {
    return person.items.reduce((total, item) => total + item.price, 0);
  };

  const calculateEachPay = (curPerInd: number, curPayToInd: number) => {
    let sumup = 0;
    let curPerSum = 0;
    if (curPerInd !== curPayToInd) {
      persons[curPerInd]?.items.forEach((item) => {
        const invKey = `inv${curPayToInd}`;
        if (Number(item.Invs[curPayToInd]?.[invKey]) !== 1.111)
          curPerSum += Number(item.Invs[curPayToInd]?.[invKey] || 0);
      });
      persons[curPayToInd]?.items.forEach((item) => {
        const invKey = `inv${curPerInd}`;
        if (Number(item.Invs[curPerInd]?.[invKey]) !== 1.111)
          sumup += Number(item.Invs[curPerInd]?.[invKey] || 0);
      });
      return (curPerSum < sumup ? sumup - curPerSum : 0).toFixed(2);
    } else {
      return sumup.toFixed(2);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const colorCode = [
    "bg-rose-400", "bg-orange-900", "bg-emerald-500", "bg-slate-600",
    "bg-cyan-500", "bg-indigo-500", "bg-orange-400", "bg-amber-400",
    "bg-sky-900", "bg-amber-200", "bg-teal-100", "bg-blue-200",
    "bg-fuchsia-300", "bg-rose-200"
  ];
  return (
    <main className="max-w-fit min-h-screen mx-auto px-6 py-12 overflow-y-auto relative">
      <div className="font-exo">
        <h1 className="text-4xl font-bold dark:text-white py-2">
          Expenses Calculator
        </h1>
        <div className="flex flex-row space-x-2 max-w-fit pb-2">
          <Input
            type="number"
            size="sm"
            value={targetPerson.toString()}
            onChange={(e) => {
              setTargetPerson(Number(e.target.value));
              addPerson();
            }}
            placeholder="target person"
            required
          />
          <Button
            fullWidth={true}
            size="sm"
            color="primary"
            variant="flat"
            type="button"
            onClick={persons.length === 0 ? addPerson : () => { setPersons([]); setTargetPerson(0); }}
          >
            {persons.length > 0 ? "Start Over" : "Add Person Involve"}
          </Button>
          <Button
            fullWidth={true}
            size="sm"
            color="primary"
            variant="bordered"
            type="button"
            onClick={toggleItemVisibility}
          >
            Toggle Items Visibility
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {persons.map((person, personIndex) => (
            <div key={`pi_${personIndex}`}>
              <Card className={`flex mb-3 shadow-md rounded-md ${personIndex > colorCode.length ? "bg-white" : colorCode[personIndex]} p-1 border-y-gray-800 text-white`}>
                <Input
                  size="sm"
                  className="text-black mt-1"
                  type="text"
                  value={person.name}
                  onChange={(e) => handlePersonNameChange(personIndex, e.target.value)}
                  placeholder="Person Name"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">
                        ${calculateTotalPrice(person)}
                      </span>
                    </div>
                  }
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">
                        {personIndex + 1}.
                      </span>
                    </div>
                  }
                  required
                />
  
                <div className="mx-1 mb-1 rounded-b-md dark:bg-black bg-white overflow-y-auto">
                  <Button
                    size="sm"
                    className="text-xl text-amber-500 absolute top-8 right-1 shadow-lg"
                    onClick={() => handleHideChange(personIndex)}
                    color="warning"
                    isIconOnly
                    variant="flat"
                    aria-label="Open"
                  >
                    {person.hide ? (
                      <BsBrightnessHighFill className="motion-safe:animate-ping motion-reduce:transition duration-500" />
                    ) : (
                      <BsBrightnessAltHighFill />
                    )}
                  </Button>
                  <div className={`transition-height ${person.hide ? "hidden" : ""}`}>
                    {person.items.map((item, itemIndex) => (
                      <div key={`it_${itemIndex}`} className="my-1">
                        <div className="flex space-x-1 px-2">
                          <Input
                            label="Item Name"
                            labelPlacement="outside"
                            size="sm"
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(personIndex, itemIndex, "name", e.target.value)}
                            placeholder="Item name"
                            required
                          />
                          <Input
                            label="Price"
                            type="number"
                            required
                            placeholder="0.00"
                            labelPlacement="outside"
                            value={item.price.toString()}
                            onChange={(e) => handleItemChange(personIndex, itemIndex, "price", e.target.value)}
                            size="sm"
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">
                                  $
                                </span>
                              </div>
                            }
                          />
                        </div>
                        <div className="flex space-x-2 px-2">
                          {item.Invs?.map((inv, invIndex) => (
                            <div key={`inv${invIndex}`}>
                              <Checkbox
                                id={`${invPre}${invIndex}`}
                                type="checkbox"
                                size="sm"
                                color="warning"
                                icon={<FaLemon />}
                                defaultSelected={Number(inv[`${invPre}${invIndex}`]) > 0}
                                isSelected={Number(inv[`${invPre}${invIndex}`]) > 0}
                                onChange={(e) => handleCheckboxChange(personIndex, itemIndex, Number(inv[`${invPre}${invIndex}`]) > 0 ? 0 : 1, invIndex)}
                              >
                                {persons[invIndex]?.name || invIndex + 1}
                              </Checkbox>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
  
                    <div className="mx-2 space-x-1">
                      <Button
                        isIconOnly
                        size="sm"
                        color="primary"
                        aria-label="Add Item"
                        onClick={() => addItem(personIndex)}
                      >
                        <FaPlusCircle />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="bordered"
                        aria-label="Remove Item"
                        onClick={() => removeItem(personIndex)}
                      >
                        <FaMinusCircle />
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2 p-2">
                    {Array.from({ length: targetPerson }, (_, index) => (
                      <div key={`payto_${index}`}>
                        <div className={personIndex === index ? "text-gray-500" : "dark:text-white text-gray-800"}>
                          <div className="text-small text-gray-200">
                            <div className={`px-1 rounded-md ${index > colorCode.length || personIndex === index ? "bg-gray-200" : colorCode[index]}`} key={`cal${index}`}>
                              Pay <b className="text-white">${calculateEachPay(personIndex, index)}</b> to {persons[index]?.name || index + 1}
                            </div>
                          </div>
                        </div>
                        <Spacer x={4} />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </form>
      </div>
    </main>
  );
  
}
