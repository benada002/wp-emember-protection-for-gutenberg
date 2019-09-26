import React, { useState, useEffect } from "react";

const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const {
  PanelBody,
  SelectControl,
  ToggleControl,
  TextareaControl
} = wp.components;
const apiFetch = wp.apiFetch;

import SelectControlSearch from "./components/select";

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
        for: [],
        not_for: [],
        member_id: [],
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

const ememberProtectionControlls = createHigherOrderComponent(
  BlockEdit => props => {
    const { ememberProtect, ememberProtectAttrs } = props.attributes;
    const { setAttributes } = props;

    const [levels, setLevels] = useState([]);
    const [forLevels, setForLevels] = useState([]);
    const [notForLevels, setNotForLevels] = useState([]);
    const [members, setMembers] = useState([]);

    function filtlerOptions(setValues, setFunction) {
      setFunction(() => [
        ...levels.filter(({ value }) => setValues.indexOf(value) === -1)
      ]);
    }

    function saveObject(key, value) {
      setAttributes({
        ememberProtectAttrs: { ...ememberProtectAttrs, [key]: value }
      });
    }

    function saveObjectAndFilterOptions(key, value, saveFilteredOptions) {
      saveObject(key, value);
      filtlerOptions(value, saveFilteredOptions);
    }

    useEffect(async () => {
      try {
        const level = await apiFetch({ path: "gepemebergutenberg/v1/levels/" });
        setLevels(level);

        const member = await apiFetch({
          path: "gepemebergutenberg/v1/members/"
        });
        setMembers(member);
      } catch (err) {
        console.error(err);
      }
    }, []);

    useEffect(() => {
      if (levels.length > 0) {
        filtlerOptions(ememberProtectAttrs.not_for, setForLevels);
        filtlerOptions(ememberProtectAttrs.for, setNotForLevels);
      }
    }, [levels, ememberProtectAttrs]);

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
              <SelectControlSearch
                label="For Levels"
                name="for-level"
                value={ememberProtectAttrs.for}
                options={forLevels}
                onChange={For =>
                  saveObjectAndFilterOptions("for", For, setNotForLevels)
                }
              />
            )}
            {ememberProtect && (
              <SelectControlSearch
                label="Hide for Levels"
                name="not-for-level"
                value={ememberProtectAttrs.not_for}
                options={notForLevels}
                onChange={not_for =>
                  saveObjectAndFilterOptions("not_for", not_for, setForLevels)
                }
              />
            )}
            {ememberProtect && (
              <SelectControlSearch
                label="For Members"
                name="for-level"
                value={ememberProtectAttrs.member_id}
                options={members}
                onChange={member => saveObject("member_id", member)}
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
  },
  "ememberProtectionControlls"
);

addFilter(
  "editor.BlockEdit",
  "gep/protectControlls",
  ememberProtectionControlls
);
