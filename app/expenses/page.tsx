"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@nextui-org/button";
import { Input, Checkbox, Spacer, Card } from "@nextui-org/react";
import { FaPlusCircle, FaMinusCircle, FaLemon } from "react-icons/fa";

type RepProperties = {
  [key: string]: number | string; // added index signature
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
}

export default function Home() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [targetPerson, setTargetPerson] = useState(0);
  const invPre = "inv";

  const handlePersonNameChange = (index: number, value: string) => {
    const newPersons = [...persons];
    newPersons[index].name = value;
    setPersons(newPersons);
  };

  const handleItemChange = (
    personIndex: number,
    itemIndex: number,
    field: "name" | "price",
    value: string | number
  ) => {
    const newPersons = [...persons];
    if (field === "price") {
      newPersons[personIndex].items[itemIndex][field] = Number(value);
      let amdInvs = [...newPersons[personIndex].items[itemIndex]?.Invs];
      //update individual price
      const totalInv = amdInvs.filter(
        (inv, ind) => inv[`${invPre}${ind}`] != 0
      );
      newPersons[personIndex].items[itemIndex].Invs = handlePrice(
        Number(value),
        totalInv.length,
        amdInvs
      );
    } else {
      newPersons[personIndex].items[itemIndex][field] = value as string;
    }
    setPersons(newPersons);
  };

  const handleCheckboxChange = (
    personIndex: number,
    itemIndex: number,
    newvalue: number,
    invIndex: number
  ) => {
    const amdPersons = [...persons];
    let amdInvs = [...amdPersons[personIndex].items[itemIndex]?.Invs];
    // Total involve other than this checkbox
    const totalInv = amdInvs.filter(
      (inv, ind) => ind != invIndex && inv[`${invPre}${ind}`] != 0
    );
    let invCount = totalInv.length;
    if (Number(newvalue) == 1) {
      invCount++;
    }
    const newprice =
      amdPersons[personIndex].items[itemIndex].price != 0
        ? amdPersons[personIndex].items[itemIndex].price / invCount
        : 0;
    if (newprice == 0) {
      const inv = `${invPre}${invIndex}`;
      amdInvs[invIndex] = {
        [inv]: Number(newvalue) == 1 ? Number(newvalue) + 0.111 : 0,
      };
      amdPersons[personIndex].items[itemIndex].Invs = amdInvs;
    } else {
      const newInvs: RepProperties[] = amdInvs.map((n, i) => {
        const inv = `${invPre}${i}`;

        if (Number(newvalue) == 0) {
          if (i == invIndex) n = { [inv]: 0 };
          else if(n[inv] != 0 && n[inv] != 0.111)
            n = { [inv]: newprice.toFixed(2) };
          
        } else {
          n = { [inv]: newprice.toFixed(2) };
        }

        return n;
      });
      amdInvs = newInvs;
    }

    amdPersons[personIndex].items[itemIndex].Invs = amdInvs;

    setPersons(amdPersons);
  };

  const handlePrice = (
    value: number,
    invCount: number,
    amdInvs: RepProperties[]
  ) => {
    const newprice = value != 0 ? value / invCount : 0;
    if (newprice != 0) {
      const newInvs: RepProperties[] = amdInvs.map((n, i) => {
        const inv = `${invPre}${i}`;
        if (n[inv] != 0) return { [inv]: newprice.toFixed(2) };
        else return { [inv]: 0 };
      });
      amdInvs = newInvs;
    }
    console.log(newprice, invCount);
    return amdInvs;
  };

  const addPerson = () => {
    if (targetPerson > 0) {
      const newPersons = [];
      for (let i = 0; i < targetPerson; i++) {
        newPersons.push({ name: "", items: [getSub()] });
      }
      //console.log(newPersons);
      setPersons(newPersons);
      //setPersons([...persons, { name: '', items: [{ name: '', price: 0 }] }]);
    }
  };

  const getSub = () => {
    const newSub: Item = { name: "", price: 0, Invs: [] };
    for (let i = 0; i < targetPerson; i++) {
      const inv = `${invPre}${i}`;
      const field = inv as keyof RepProperties;
      if (newSub.Invs) {
        // check if Invs is not undefined
        newSub.Invs.push({ [field]: 1.111 });
      }
    }
    return newSub;
  };

  //const removePerson = () => {
  //if (persons.length > 0) {
  //setPersons(persons.slice(0, -1));
  //}
  //};

  const addItem = (personIndex: number) => {
    const newPersons = [...persons];
    newPersons[personIndex].items.push(getSub());
    setPersons(newPersons);
  };

  const removeItem = (personIndex: number) => {
    const newPersons = [...persons];
    if (newPersons[personIndex].items.length > 1) {
      newPersons[personIndex].items.pop();
    }
    setPersons(newPersons);
  };

  const calculateTotalPrice = (person: Person) => {
    return person.items.reduce((total, item) => total + item.price, 0);
  };

  const calculateEachPay = (curPerInd: number, curPayToInd: number) => {
    let sumup = 0;
    let curPerSum = 0;
    if (curPerInd != curPayToInd) {
    persons[curPerInd]?.items.filter((item) => {
      const invKey = `inv${curPayToInd}`; // dynamically create the key
      if (item?.Invs[curPayToInd]?.[invKey]) {
      if (Number(item?.Invs[curPayToInd]?.[invKey]) != 1.111)
      curPerSum = curPerSum + Number(item.Invs[curPayToInd][invKey]);
      }
    });
    persons[curPayToInd]?.items.filter((item) => {
      const invKey = `inv${curPerInd}`; // dynamically create the key
      if (item?.Invs[curPayToInd]?.[invKey]) {
      if (Number(item?.Invs[curPerInd]?.[invKey]) != 1.111)
        sumup = sumup + Number(item.Invs[curPerInd][invKey]);
      }
    });

    //console.log('cur per total: ' + curPerTotal + 'total price' + totalPrice);
    const test = curPerSum < sumup ? sumup - curPerSum : 0;
    return test.toFixed(2);
  } else
  return sumup.toFixed(2);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Optional: Handle form submission if needed
  };

  const colorCode = [
    "bg-rose-400",
    "bg-orange-900",
    "bg-emerald-500",
    "bg-slate-600",
    "bg-cyan-500",
    "bg-indigo-500",
"bg-orange-400",
    "bg-amber-400",
    "bg-sky-900",
    "bg-amber-200",
    "bg-teal-100",
    "bg-blue-200",
    "bg-fuchsia-300",
    "bg-rose-200   ",
  ];
   const btnstyle2 =
    "font-bold m-1 inline-block rounded bg-neutral-800 px-3 py-1 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-dark-3 transition duration-150 ease-in-out hover:bg-neutral-700 hover:shadow-dark-2 focus:bg-neutral-700 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-dark-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong";
  return (
    <>
      <main className="max-w-fit min-h-screen mx-auto px-6 py-12 overflow-y-auto relative">
        <div style={{ fontFamily: "Exo 2, sans-serif" }}>
          <h1 className="text-4xl font-bold dark:text-white py-2">
            Expenses Calculator
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-row space-x-2 p-2">
            {persons.map((person, personIndex) => (
              <div key={`pi_${personIndex}`} className="">
          
                  <Card
                    className={`flex mb-3 shadow-md rounded-md ${
                      personIndex > colorCode.length
                        ? "bg-white"
                        : colorCode[personIndex]
                    } p-1 border-y-gray-800 text-white`}
                  >
                    
                    <Input
                      size="sm"
                      className="text-black mt-1"
                      type="text"
                      value={person.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handlePersonNameChange(personIndex, e.target.value)
                      }
                      placeholder="Person Name"
                      endContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">
                          ${calculateTotalPrice(person)}</span>
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
                  
                  <div className="mx-1 mb-1 rounded-b-md dark:bg-black bg-white">
                    {person.items.map((item, itemIndex) => (
                      <div key={`it_${itemIndex}`} className="my-1">
                        <div className="flex space-x-1 px-2">
                         
                          <Input
                            label="Item Name"
                            labelPlacement="outside"
                            size="sm"
                            type="text"
                            value={item.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleItemChange(
                                personIndex,
                                itemIndex,
                                "name",
                                e.target.value
                              )
                            }
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleItemChange(
                                personIndex,
                                itemIndex,
                                "price",
                                e.target.value
                              )
                            }
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
                                icon={<FaLemon/>}
                                defaultSelected={Number(inv[`${invPre}${invIndex}`]) > 0}
                                isSelected={
                                  Number(inv[`${invPre}${invIndex}`]) > 0
                                }
                            
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  handleCheckboxChange(
                                    personIndex,
                                    itemIndex,
                                    Number(inv[`${invPre}${invIndex}`]) > 0
                                      ? 0
                                      : 1,
                                    invIndex
                                  )
                                }
                              >
                                {persons[invIndex].name || invIndex + 1}
                              </Checkbox>
                              
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="mx-2  space-x-1">
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
                    <div className="flex space-x-2 p-2">
                      {Array.from({ length: targetPerson }, (_, index) => (
                       <div
                       key={`payto_${index}`}>
                        <div
                         
                          className={
                            personIndex === index
                              ? "text-gray-500"
                              : "dark:text-white text-gray-800"
                          }
                        >
                          <div className="text-small text-gray-200 ">
                         
                            
                            <div
                              className={`px-1 rounded-md ${
                                index > colorCode.length ||
                                personIndex === index
                                  ? "bg-gray-200"
                                  : colorCode[index]
                              }`}
                              key={`cal${index}`}
                            >
                             Pay <b className="text-white">${calculateEachPay(personIndex, index)}</b> to  
                             {` `}
                             {persons[index]?.name || index + 1} 
                            </div>
                          </div>
                        </div>
                        <Spacer x={4} /></div>
                      ))}
                    </div>
                   
                  </div>
                  </Card>
       
              </div>
            ))}
           
          </form>
          <div className="mx-auto max-w-80 px-5 float-left flex-row">
          <Input
              type="number"
              size="sm"
              
              value={targetPerson.toString()}
              onChange={(e) => 
                {
                  
                  setTargetPerson(Number(e.target.value))
                  addPerson
                }}
              placeholder="target person"
              required
            />
            <Button size="sm" className={btnstyle2} type="button" onClick={addPerson}>
              Add Person Involve
            </Button>
          </div>
         
        </div>
      </main>
    </>
  );
}
