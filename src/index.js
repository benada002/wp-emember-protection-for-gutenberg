const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const {
  PanelBody,
  SelectControl,
  ToggleControl,
  TextControl,
  TextareaControl
} = wp.components;

const ememberScope = [
  { value: "", label: "Not Set" },
  { value: "verified_users_only", label: "Verified users only" },
  { value: "not_logged_in_users_only", label: "Not logged in users only" },
  { value: "expired", label: "Expired members only" }
];

const addEmemberControlAttribute = settings => {
  settings.attributes = {
    ...settings.attributes,
    ememberProtect: {
      type: "boolean",
      default: false
    },
    ememberProtectAttrs: {
      type: "object",
      default: {
        for: "",
        not_for: "",
        member_id: "",
        scope: ememberScope[0].value,
        do_not_show_restricted_msg: false,
        do_not_show_expired_msg: false,
        custom_msg: ""
      }
    }
  };

  return settings;
};

addFilter(
  "blocks.registerBlockType",
  "gep/protectAttribute",
  addEmemberControlAttribute
);

const ememberProtectionControlls = createHigherOrderComponent(BlockEdit => {
  return props => {
    const { ememberProtect, ememberProtectAttrs } = props.attributes;
    const { setAttributes } = props;
    function saveObject(key, value) {
      setAttributes({
        ememberProtectAttrs: { ...ememberProtectAttrs, [key]: value }
      });
    }

    return (
      <Fragment>
        <BlockEdit {...props} />
        <InspectorControls>
          <PanelBody title={"Protect with WP-eMember"} initialOpen={false}>
            <ToggleControl
              label={"Protect Block"}
              checked={!!ememberProtect}
              onChange={() => {
                setAttributes({
                  ememberProtect: !ememberProtect
                });
              }}
            />
            {ememberProtect && (
              <TextControl
                label="Show for level(s)"
                value={ememberProtectAttrs.for}
                onChange={For => saveObject("for", For)}
              />
            )}
            {ememberProtect && (
              <TextControl
                label="Hide for level(s)"
                value={ememberProtectAttrs.not_for}
                onChange={not_for => saveObject("not_for", not_for)}
              />
            )}
            {ememberProtect && (
              <TextControl
                label="Show for member(s)"
                value={ememberProtectAttrs.member_id}
                onChange={member_id => saveObject("member_id", member_id)}
              />
            )}
            {ememberProtect && (
              <SelectControl
                label="Show for scope"
                value={ememberProtectAttrs.scope}
                options={ememberScope}
                onChange={scope => saveObject("scope", scope)}
              />
            )}
            {ememberProtect && (
              <ToggleControl
                label={"Hide restriction message"}
                checked={!!ememberProtectAttrs.do_not_show_restricted_msg}
                onChange={() =>
                  saveObject(
                    "do_not_show_restricted_msg",
                    !ememberProtectAttrs.do_not_show_restricted_msg
                  )
                }
              />
            )}
            {ememberProtect && (
              <ToggleControl
                label={"Hide expiration message"}
                checked={!!ememberProtectAttrs.do_not_show_expired_msg}
                onChange={() =>
                  saveObject(
                    "do_not_show_expired_msg",
                    !ememberProtectAttrs.do_not_show_expired_msg
                  )
                }
              />
            )}
            {ememberProtect && (
              <TextareaControl
                label="Custom Message"
                value={ememberProtectAttrs.custom_msg}
                onChange={custom_msg => setAttributes("custom_msg", custom_msg)}
              />
            )}
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  };
}, "ememberProtectionControlls");

addFilter(
  "editor.BlockEdit",
  "gep/protectControlls",
  ememberProtectionControlls
);
