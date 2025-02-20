export const ModalWrapper = ({ children, user }) => {
  return (
    <>
      {/* <button
        className="px-4 py-2 hover:bg-base-200 cursor-pointer"
        onClick={() => document.getElementById("my_modal_2").showModal()}
      >
        {user?.fullName}
      </button> */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box p-0">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {children}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
