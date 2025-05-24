class ConfirmButton extends ButtonWidget {
  constructor(id, parentElement, label = 'Confirm', palette = null) {
    super(id, parentElement, label, palette);
  }

  handleClick() {
    this.setState({ label: 'Are you sure?' });
    // trigger confirm modal here...
  }
}
