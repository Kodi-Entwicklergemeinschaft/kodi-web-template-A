// ⚙️ Auto-generated from en.json
// Do not edit manually

export interface TranslationSchema {
  heading: string;
  toggleTheme: string;
  signIntoAccount: string;
  email: string;
  emailOrUsernameLabel: string;
  usernameOrEmail: string;
  password: string;
  pleaseEnterPassword: string;
  rememberMe: string;
  forgotYourPassword: string;
  resetPassword: string;
  signIn: string;
  notMember: string;
  register: string;
  signInHelp: string;
  invalidMail: string;
  invalidMailOrUsername: string;
  minContainInMail: string;
  maxContentInMail: string;
  passwordRequired: string;
  sendLink: string;
  cancel: string;
  addMore: string;
  deleteAccount: string;
  status: string;
  active: string;
  inactive: string;
  anleitung: string;
  subtitle: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  thankYou: string;
  logout: string;
  Close: string;
  sidebar: {
    tileManagement: {
      title: string;
      upload: string;
      listing: string;
    };
    listingManagement: {
      title: string;
      upload: string;
      listing: string;
    };
    categoryManagement: {
      title: string;
      create: string;
      listing: string;
      cityCategory: string;
      updateCityCategory: string;
    };
    accounts: {
      title: string;
    };
    cityAdmin: {
      title: string;
    };
  };
  createAccount: string;
  category: {
    form: {
      name: {
        error: {
          minLength: string;
          maxLength: string;
        };
      };
      subtitle: {
        error: {
          minLength: string;
          maxLength: string;
        };
      };
      description: {
        error: {
          minLength: string;
        };
      };
      headerColor: {
        error: {
          required: string;
        };
      };
      contentColor: {
        error: {
          required: string;
        };
      };
      backgroundImage: {
        error: {
          required: string;
        };
      };
      iconImageUrl: {
        error: {
          required: string;
        };
      };
    };
    create: {
      heading: string;
      editHeading: string;
      editDescription: string;
      description: string;
      addSubCategory: string;
      fix_main_category: string;
      cat_and_subCate_created: string;
      categoryUpdate_image_failed: string;
      categoryCreate_image_failed: string;
      failed_to_create_category: string;
      failed_to_update_category: string;
      categoryNotfound: string;
      subCategory: {
        heading: string;
        editHeading: string;
        editDescription: string;
        description: string;
        subCategory_validation: string;
        cannotadd3subCategory: string;
        fix_sub_category: string;
        failed_create_subcategory: string;
        max_3_sub_category: string;
        subCategory_label: string;
        max_3_sub_category_count: string;
      };
      icon: {
        not_delete_icon: string;
        icon_delete_success: string;
        failed_delete: string;
      };
      image: {
        not_delete_image: string;
        image_delete_success: string;
        failed_delete: string;
      };
      subcategory: {
        no_sub_id: string;
      };
      form: {
        name: {
          label: string;
          placeholder: string;
          error: {
            minLength: string;
            maxLength: string;
          };
        };
        subtitle: {
          label: string;
          placeholder: string;
          error: {
            minLength: string;
            maxLength: string;
          };
        };
        description: {
          label: string;
          placeholder: string;
          error: {
            minLength: string;
          };
        };
        headerColor: {
          label: string;
          error: {
            required: string;
          };
        };
        contentColor: {
          label: string;
          error: {
            required: string;
          };
        };
        icon: {
          label: string;
        };
        backgroundImage: {
          label: string;
          error: {
            required: string;
          };
        };
        isActive: {
          label: string;
          placeholder: string;
          active: string;
          inactive: string;
        };
        parentId: {
          label: string;
          placeholder: string;
        };
        displayOrder: {
          label: string;
          placeholder: string;
        };
      };
      preview: {
        heading: string;
        cityHeading: string;
        cityDescription: string;
        citySubHeading: string;
        citySubDescription: string;
        description: string;
        defaultName: string;
        defaultSubtitle: string;
        defaultDescription: string;
      };
    };
    listing: {
      heading: string;
      cityHeading: string;
      cityDescription: string;
      description: string;
      createBtn: string;
      searchPlaceholder: string;
      noCategories: string;
      table: {
        name: string;
        description: string;
        type: string;
        displayOrder: string;
        actions: string;
      };
      confirmDelete: {
        heading: string;
        message: string;
        confirmMessage: string;
        cancelMessage: string;
      };
      deleteSuccess: string;
      deleteError: string;
    };
    update: {
      heading: string;
      description: string;
      editSubCategory: string;
      editCityCategory: string;
    };
  };
  tile: {
    upload: {
      heading: string;
      description: string;
      form: {
        uploadLabel: string;
        uploadBtnLabel: string;
        uploadPlaceholder: string;
        displayOrder: {
          label: string;
          placeholder: string;
        };
        tileName: {
          label: string;
          placeholder: string;
        };
        redirectURL: {
          label: string;
          placeholder: string;
        };
        titleColor: {
          label: string;
        };
        subHeader: {
          label: string;
          placeholder: string;
        };
        tileDescription: {
          label: string;
          placeholder: string;
        };
        titleDescriptionColor: {
          label: string;
        };
        errorName: {
          maxFileSize: string;
          supportedExtension: string;
          invalidFile: string;
        };
        tileIcon: {
          label: string;
        };
        tileImage: {
          label: string;
        };
      };
      previewHeading: string;
      previewDescription: string;
      dummyText: string;
      defaultHeader: string;
      tilePreviewDescription: string;
    };
    edit: {
      heading: string;
      description: string;
    };
    listingHeading: string;
    listingDescription: string;
    searchPlaceholder: string;
    active: string;
    inactive: string;
    tabs: {
      allTiles: string;
      pendingTiles: string;
      inactiveTiles: string;
      hiddenTiles: string;
    };
    table: {
      head: {
        tile: string;
        status: string;
        displayOrder: string;
        description: string;
        actions: string;
      };
      noData: string;
    };
    confirmDelete: {
      heading: string;
      message: string;
      confirmMessage: string;
      cancelMessage: string;
    };
  };
  formMessages: {
    uploadField: {
      label: string;
      btnLabel: string;
      placeholder: string;
      errorName: {
        maxFileSizeFileUpload: string;
        maxFileSize: string;
        supportedExtension: string;
        invalidFile: string;
        minLength: string;
        maxLength: string;
        titleColor: string;
        tileIcon: string;
        tileDescription: string;
        titleDescriptionColor: string;
        tileImage: string;
        subHeader: string;
        subHeaderMax: string;
        minDisplayOrder: string;
        maxDisplayOrder: string;
      };
    };
    uploadListing: {
      errorName: {
        heroImageRequired: string;
        listingNameRequired: string;
        listingNameMaxLength: string;
        listingNameMinLength: string;
        address: string;
        startDate: string;
        endDate: string;
        city: string;
        tags: string;
        websiteUrl: string;
        category: string;
      };
    };
  };
  cityAdministration: {
    heading: string;
    description: string;
    createAdmin: string;
    table: {
      head: {
        name: string;
        email: string;
        role: string;
        status: string;
        createdAt: string;
        cities: string;
        actions: string;
        registered: string;
      };
      noData: string;
    };
    confirmDelete: {
      heading: string;
      message: string;
      confirmMessage: string;
      cancelMessage: string;
    };
  };
  accountSetting: {
    heading: string;
    description: string;
    section: {
      personalInfo: {
        heading: string;
        description: string;
      };
      accountInfo: {
        heading: string;
        description: string;
      };
      metadata: {
        heading: string;
        description: string;
      };
      password: {
        heading: string;
        description: string;
      };
    };
    form: {
      maxSocialLinks: string;
      saveBtn: string;
      resetBtn: string;
      email: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          minContent: string;
          maxContent: string;
        };
      };
      username: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          minContent: string;
          maxContent: string;
        };
      };
      currentPassword: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          minContent: string;
          maxContent: string;
        };
      };
      newPassword: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          minContent: string;
          maxContent: string;
        };
      };
      confirmPassword: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          minContent: string;
          maxContent: string;
          passwordMismatch: string;
        };
      };
      yourName: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          minContent: string;
          maxContent: string;
        };
      };
      phoneNumber: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          minContent: string;
          maxContent: string;
        };
      };
      description: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          minContent: string;
          maxContent: string;
        };
      };
      website: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          minContent: string;
          maxContent: string;
          duplicateWebsite: string;
        };
      };
      websiteLink: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          minContent: string;
          maxContent: string;
          invalidLink: string;
          duplicateLink: string;
        };
      };
    };
  };
  registration: {
    general: {
      alreadyHaveAccount: string;
      login: string;
      acceptPolicy: string;
      privacy: string;
      and: string;
      terms: string;
      mustAcceptTermsAndPrivacy: string;
    };
    form: {
      email: {
        error: {
          invalidMail: string;
        };
      };
      username: {
        label: string;
        placeholder: string;
        error: {
          minContent: string;
          maxContent: string;
          noSpaces: string;
        };
      };
      firstName: {
        label: string;
        placeholder: string;
        error: {
          minContent: string;
          maxContent: string;
          noSpaces: string;
          invalidChars: string;
        };
      };
      lastName: {
        label: string;
        placeholder: string;
        error: {
          minContent: string;
          maxContent: string;
          noSpaces: string;
          invalidChars: string;
        };
      };
      password: {
        label: string;
        placeholder: string;
        error: {
          minContent: string;
          maxContent: string;
          noSpaces: string;
        };
      };
      confirmPassword: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          mismatch: string;
        };
      };
    };
  };
  switchRole: {
    title: string;
    description: string;
    selectRole: string;
    selectCity: string;
  };
  user: {
    restore: string;
    restoreFailed: string;
    disable: string;
    disableFailed: string;
    roleAssign: string;
    roleAssignFailed: string;
    select_city: string;
  };
  unAuthorized: {
    heading: string;
    description: string;
    goBack: string;
  };
  pagination: {
    previous: string;
    next: string;
  };
  listing: {
    upload: {
      heading: string;
      description: string;
      form: {
        heroImageUrl: {
          label: string;
          placeholder: string;
        };
        listingName: {
          label: string;
          placeholder: string;
        };
        address: {
          label: string;
          placeholder: string;
          searching: string;
        };
        startDate: {
          label: string;
          placeholder: string;
        };
        endDate: {
          label: string;
          placeholder: string;
        };
        city: {
          label: string;
          placeholder: string;
        };
        category: {
          label: string;
          placeholder: string;
        };
        subCategory: {
          label: string;
          placeholder: string;
        };
        tags: {
          label: string;
          placeholder: string;
        };
        summary: {
          label: string;
          placeholder: string;
        };
        listingDescription: {
          label: string;
          placeholder: string;
        };
        email: {
          label: string;
          placeholder: string;
        };
        phone: {
          label: string;
          placeholder: string;
        };
        websiteUrl: {
          label: string;
          placeholder: string;
        };
        media: {
          label: string;
        };
      };
    };
    edit: {
      heading: string;
      description: string;
    };
    listingHeading: string;
    listingDescription: string;
    searchPlaceholder: string;
    active: string;
    inactive: string;
    tabs: {
      allLists: string;
      pendingLists: string;
      inactiveLists: string;
      hiddenLists: string;
    };
    table: {
      head: {
        list: string;
        status: string;
        description: string;
        actions: string;
      };
      noData: string;
    };
  };
  list: {
    upload: {
      dummyText: string;
      defaultHeader: string;
      listPreviewDescription: string;
      previewHeading: string;
      previewDescription: string;
      dateFormat: string;
    };
  };
  removeImage: string;
  deleteMetadata: string;
  removeSubcategory: string;
  termsConditions: {
    noData: string;
  };
}

export type TranslationKey =
  | 'heading'
  | 'toggleTheme'
  | 'signIntoAccount'
  | 'email'
  | 'emailOrUsernameLabel'
  | 'usernameOrEmail'
  | 'password'
  | 'pleaseEnterPassword'
  | 'rememberMe'
  | 'forgotYourPassword'
  | 'resetPassword'
  | 'signIn'
  | 'notMember'
  | 'register'
  | 'signInHelp'
  | 'invalidMail'
  | 'invalidMailOrUsername'
  | 'minContainInMail'
  | 'maxContentInMail'
  | 'passwordRequired'
  | 'sendLink'
  | 'cancel'
  | 'addMore'
  | 'deleteAccount'
  | 'status'
  | 'active'
  | 'inactive'
  | 'anleitung'
  | 'subtitle'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'thankYou'
  | 'logout'
  | 'Close'
  | 'sidebar.tileManagement.title'
  | 'sidebar.tileManagement.upload'
  | 'sidebar.tileManagement.listing'
  | 'sidebar.listingManagement.title'
  | 'sidebar.listingManagement.upload'
  | 'sidebar.listingManagement.listing'
  | 'sidebar.categoryManagement.title'
  | 'sidebar.categoryManagement.create'
  | 'sidebar.categoryManagement.listing'
  | 'sidebar.categoryManagement.cityCategory'
  | 'sidebar.categoryManagement.updateCityCategory'
  | 'sidebar.accounts.title'
  | 'sidebar.cityAdmin.title'
  | 'createAccount'
  | 'category.form.name.error.minLength'
  | 'category.form.name.error.maxLength'
  | 'category.form.subtitle.error.minLength'
  | 'category.form.subtitle.error.maxLength'
  | 'category.form.description.error.minLength'
  | 'category.form.headerColor.error.required'
  | 'category.form.contentColor.error.required'
  | 'category.form.backgroundImage.error.required'
  | 'category.form.iconImageUrl.error.required'
  | 'category.create.heading'
  | 'category.create.editHeading'
  | 'category.create.editDescription'
  | 'category.create.description'
  | 'category.create.addSubCategory'
  | 'category.create.fix_main_category'
  | 'category.create.cat_and_subCate_created'
  | 'category.create.categoryUpdate_image_failed'
  | 'category.create.categoryCreate_image_failed'
  | 'category.create.failed_to_create_category'
  | 'category.create.failed_to_update_category'
  | 'category.create.categoryNotfound'
  | 'category.create.subCategory.heading'
  | 'category.create.subCategory.editHeading'
  | 'category.create.subCategory.editDescription'
  | 'category.create.subCategory.description'
  | 'category.create.subCategory.subCategory_validation'
  | 'category.create.subCategory.cannotadd3subCategory'
  | 'category.create.subCategory.fix_sub_category'
  | 'category.create.subCategory.failed_create_subcategory'
  | 'category.create.subCategory.max_3_sub_category'
  | 'category.create.subCategory.subCategory_label'
  | 'category.create.subCategory.max_3_sub_category_count'
  | 'category.create.icon.not_delete_icon'
  | 'category.create.icon.icon_delete_success'
  | 'category.create.icon.failed_delete'
  | 'category.create.image.not_delete_image'
  | 'category.create.image.image_delete_success'
  | 'category.create.image.failed_delete'
  | 'category.create.subcategory.no_sub_id'
  | 'category.create.form.name.label'
  | 'category.create.form.name.placeholder'
  | 'category.create.form.name.error.minLength'
  | 'category.create.form.name.error.maxLength'
  | 'category.create.form.subtitle.label'
  | 'category.create.form.subtitle.placeholder'
  | 'category.create.form.subtitle.error.minLength'
  | 'category.create.form.subtitle.error.maxLength'
  | 'category.create.form.description.label'
  | 'category.create.form.description.placeholder'
  | 'category.create.form.description.error.minLength'
  | 'category.create.form.headerColor.label'
  | 'category.create.form.headerColor.error.required'
  | 'category.create.form.contentColor.label'
  | 'category.create.form.contentColor.error.required'
  | 'category.create.form.icon.label'
  | 'category.create.form.backgroundImage.label'
  | 'category.create.form.backgroundImage.error.required'
  | 'category.create.form.isActive.label'
  | 'category.create.form.isActive.placeholder'
  | 'category.create.form.isActive.active'
  | 'category.create.form.isActive.inactive'
  | 'category.create.form.parentId.label'
  | 'category.create.form.parentId.placeholder'
  | 'category.create.form.displayOrder.label'
  | 'category.create.form.displayOrder.placeholder'
  | 'category.create.preview.heading'
  | 'category.create.preview.cityHeading'
  | 'category.create.preview.cityDescription'
  | 'category.create.preview.citySubHeading'
  | 'category.create.preview.citySubDescription'
  | 'category.create.preview.description'
  | 'category.create.preview.defaultName'
  | 'category.create.preview.defaultSubtitle'
  | 'category.create.preview.defaultDescription'
  | 'category.listing.heading'
  | 'category.listing.cityHeading'
  | 'category.listing.cityDescription'
  | 'category.listing.description'
  | 'category.listing.createBtn'
  | 'category.listing.searchPlaceholder'
  | 'category.listing.noCategories'
  | 'category.listing.table.name'
  | 'category.listing.table.description'
  | 'category.listing.table.type'
  | 'category.listing.table.displayOrder'
  | 'category.listing.table.actions'
  | 'category.listing.confirmDelete.heading'
  | 'category.listing.confirmDelete.message'
  | 'category.listing.confirmDelete.confirmMessage'
  | 'category.listing.confirmDelete.cancelMessage'
  | 'category.listing.deleteSuccess'
  | 'category.listing.deleteError'
  | 'category.update.heading'
  | 'category.update.description'
  | 'category.update.editSubCategory'
  | 'category.update.editCityCategory'
  | 'tile.upload.heading'
  | 'tile.upload.description'
  | 'tile.upload.form.uploadLabel'
  | 'tile.upload.form.uploadBtnLabel'
  | 'tile.upload.form.uploadPlaceholder'
  | 'tile.upload.form.displayOrder.label'
  | 'tile.upload.form.displayOrder.placeholder'
  | 'tile.upload.form.tileName.label'
  | 'tile.upload.form.tileName.placeholder'
  | 'tile.upload.form.redirectURL.label'
  | 'tile.upload.form.redirectURL.placeholder'
  | 'tile.upload.form.titleColor.label'
  | 'tile.upload.form.subHeader.label'
  | 'tile.upload.form.subHeader.placeholder'
  | 'tile.upload.form.tileDescription.label'
  | 'tile.upload.form.tileDescription.placeholder'
  | 'tile.upload.form.titleDescriptionColor.label'
  | 'tile.upload.form.errorName.maxFileSize'
  | 'tile.upload.form.errorName.supportedExtension'
  | 'tile.upload.form.errorName.invalidFile'
  | 'tile.upload.form.tileIcon.label'
  | 'tile.upload.form.tileImage.label'
  | 'tile.upload.previewHeading'
  | 'tile.upload.previewDescription'
  | 'tile.upload.dummyText'
  | 'tile.upload.defaultHeader'
  | 'tile.upload.tilePreviewDescription'
  | 'tile.edit.heading'
  | 'tile.edit.description'
  | 'tile.listingHeading'
  | 'tile.listingDescription'
  | 'tile.searchPlaceholder'
  | 'tile.active'
  | 'tile.inactive'
  | 'tile.tabs.allTiles'
  | 'tile.tabs.pendingTiles'
  | 'tile.tabs.inactiveTiles'
  | 'tile.tabs.hiddenTiles'
  | 'tile.table.head.tile'
  | 'tile.table.head.status'
  | 'tile.table.head.displayOrder'
  | 'tile.table.head.description'
  | 'tile.table.head.actions'
  | 'tile.table.noData'
  | 'tile.confirmDelete.heading'
  | 'tile.confirmDelete.message'
  | 'tile.confirmDelete.confirmMessage'
  | 'tile.confirmDelete.cancelMessage'
  | 'formMessages.uploadField.label'
  | 'formMessages.uploadField.btnLabel'
  | 'formMessages.uploadField.placeholder'
  | 'formMessages.uploadField.errorName.maxFileSizeFileUpload'
  | 'formMessages.uploadField.errorName.maxFileSize'
  | 'formMessages.uploadField.errorName.supportedExtension'
  | 'formMessages.uploadField.errorName.invalidFile'
  | 'formMessages.uploadField.errorName.minLength'
  | 'formMessages.uploadField.errorName.maxLength'
  | 'formMessages.uploadField.errorName.titleColor'
  | 'formMessages.uploadField.errorName.tileIcon'
  | 'formMessages.uploadField.errorName.tileDescription'
  | 'formMessages.uploadField.errorName.titleDescriptionColor'
  | 'formMessages.uploadField.errorName.tileImage'
  | 'formMessages.uploadField.errorName.subHeader'
  | 'formMessages.uploadField.errorName.subHeaderMax'
  | 'formMessages.uploadField.errorName.minDisplayOrder'
  | 'formMessages.uploadField.errorName.maxDisplayOrder'
  | 'formMessages.uploadListing.errorName.heroImageRequired'
  | 'formMessages.uploadListing.errorName.listingNameRequired'
  | 'formMessages.uploadListing.errorName.listingNameMaxLength'
  | 'formMessages.uploadListing.errorName.listingNameMinLength'
  | 'formMessages.uploadListing.errorName.address'
  | 'formMessages.uploadListing.errorName.startDate'
  | 'formMessages.uploadListing.errorName.endDate'
  | 'formMessages.uploadListing.errorName.city'
  | 'formMessages.uploadListing.errorName.tags'
  | 'formMessages.uploadListing.errorName.websiteUrl'
  | 'formMessages.uploadListing.errorName.category'
  | 'cityAdministration.heading'
  | 'cityAdministration.description'
  | 'cityAdministration.createAdmin'
  | 'cityAdministration.table.head.name'
  | 'cityAdministration.table.head.email'
  | 'cityAdministration.table.head.role'
  | 'cityAdministration.table.head.status'
  | 'cityAdministration.table.head.createdAt'
  | 'cityAdministration.table.head.cities'
  | 'cityAdministration.table.head.actions'
  | 'cityAdministration.table.head.registered'
  | 'cityAdministration.table.noData'
  | 'cityAdministration.confirmDelete.heading'
  | 'cityAdministration.confirmDelete.message'
  | 'cityAdministration.confirmDelete.confirmMessage'
  | 'cityAdministration.confirmDelete.cancelMessage'
  | 'accountSetting.heading'
  | 'accountSetting.description'
  | 'accountSetting.section.personalInfo.heading'
  | 'accountSetting.section.personalInfo.description'
  | 'accountSetting.section.accountInfo.heading'
  | 'accountSetting.section.accountInfo.description'
  | 'accountSetting.section.metadata.heading'
  | 'accountSetting.section.metadata.description'
  | 'accountSetting.section.password.heading'
  | 'accountSetting.section.password.description'
  | 'accountSetting.form.maxSocialLinks'
  | 'accountSetting.form.saveBtn'
  | 'accountSetting.form.resetBtn'
  | 'accountSetting.form.email.label'
  | 'accountSetting.form.email.placeholder'
  | 'accountSetting.form.email.error.required'
  | 'accountSetting.form.email.error.minContent'
  | 'accountSetting.form.email.error.maxContent'
  | 'accountSetting.form.username.label'
  | 'accountSetting.form.username.placeholder'
  | 'accountSetting.form.username.error.required'
  | 'accountSetting.form.username.error.minContent'
  | 'accountSetting.form.username.error.maxContent'
  | 'accountSetting.form.currentPassword.label'
  | 'accountSetting.form.currentPassword.placeholder'
  | 'accountSetting.form.currentPassword.error.required'
  | 'accountSetting.form.currentPassword.error.minContent'
  | 'accountSetting.form.currentPassword.error.maxContent'
  | 'accountSetting.form.newPassword.label'
  | 'accountSetting.form.newPassword.placeholder'
  | 'accountSetting.form.newPassword.error.required'
  | 'accountSetting.form.newPassword.error.minContent'
  | 'accountSetting.form.newPassword.error.maxContent'
  | 'accountSetting.form.confirmPassword.label'
  | 'accountSetting.form.confirmPassword.placeholder'
  | 'accountSetting.form.confirmPassword.error.required'
  | 'accountSetting.form.confirmPassword.error.minContent'
  | 'accountSetting.form.confirmPassword.error.maxContent'
  | 'accountSetting.form.confirmPassword.error.passwordMismatch'
  | 'accountSetting.form.yourName.label'
  | 'accountSetting.form.yourName.placeholder'
  | 'accountSetting.form.yourName.error.required'
  | 'accountSetting.form.yourName.error.minContent'
  | 'accountSetting.form.yourName.error.maxContent'
  | 'accountSetting.form.phoneNumber.label'
  | 'accountSetting.form.phoneNumber.placeholder'
  | 'accountSetting.form.phoneNumber.error.required'
  | 'accountSetting.form.phoneNumber.error.minContent'
  | 'accountSetting.form.phoneNumber.error.maxContent'
  | 'accountSetting.form.description.label'
  | 'accountSetting.form.description.placeholder'
  | 'accountSetting.form.description.error.required'
  | 'accountSetting.form.description.error.minContent'
  | 'accountSetting.form.description.error.maxContent'
  | 'accountSetting.form.website.label'
  | 'accountSetting.form.website.placeholder'
  | 'accountSetting.form.website.error.required'
  | 'accountSetting.form.website.error.minContent'
  | 'accountSetting.form.website.error.maxContent'
  | 'accountSetting.form.website.error.duplicateWebsite'
  | 'accountSetting.form.websiteLink.label'
  | 'accountSetting.form.websiteLink.placeholder'
  | 'accountSetting.form.websiteLink.error.required'
  | 'accountSetting.form.websiteLink.error.minContent'
  | 'accountSetting.form.websiteLink.error.maxContent'
  | 'accountSetting.form.websiteLink.error.invalidLink'
  | 'accountSetting.form.websiteLink.error.duplicateLink'
  | 'registration.general.alreadyHaveAccount'
  | 'registration.general.login'
  | 'registration.general.acceptPolicy'
  | 'registration.general.privacy'
  | 'registration.general.and'
  | 'registration.general.terms'
  | 'registration.general.mustAcceptTermsAndPrivacy'
  | 'registration.form.email.error.invalidMail'
  | 'registration.form.username.label'
  | 'registration.form.username.placeholder'
  | 'registration.form.username.error.minContent'
  | 'registration.form.username.error.maxContent'
  | 'registration.form.username.error.noSpaces'
  | 'registration.form.firstName.label'
  | 'registration.form.firstName.placeholder'
  | 'registration.form.firstName.error.minContent'
  | 'registration.form.firstName.error.maxContent'
  | 'registration.form.firstName.error.noSpaces'
  | 'registration.form.firstName.error.invalidChars'
  | 'registration.form.lastName.label'
  | 'registration.form.lastName.placeholder'
  | 'registration.form.lastName.error.minContent'
  | 'registration.form.lastName.error.maxContent'
  | 'registration.form.lastName.error.noSpaces'
  | 'registration.form.lastName.error.invalidChars'
  | 'registration.form.password.label'
  | 'registration.form.password.placeholder'
  | 'registration.form.password.error.minContent'
  | 'registration.form.password.error.maxContent'
  | 'registration.form.password.error.noSpaces'
  | 'registration.form.confirmPassword.label'
  | 'registration.form.confirmPassword.placeholder'
  | 'registration.form.confirmPassword.error.required'
  | 'registration.form.confirmPassword.error.mismatch'
  | 'switchRole.title'
  | 'switchRole.description'
  | 'switchRole.selectRole'
  | 'switchRole.selectCity'
  | 'user.restore'
  | 'user.restoreFailed'
  | 'user.disable'
  | 'user.disableFailed'
  | 'user.roleAssign'
  | 'user.roleAssignFailed'
  | 'user.select_city'
  | 'unAuthorized.heading'
  | 'unAuthorized.description'
  | 'unAuthorized.goBack'
  | 'pagination.previous'
  | 'pagination.next'
  | 'listing.upload.heading'
  | 'listing.upload.description'
  | 'listing.upload.form.heroImageUrl.label'
  | 'listing.upload.form.heroImageUrl.placeholder'
  | 'listing.upload.form.listingName.label'
  | 'listing.upload.form.listingName.placeholder'
  | 'listing.upload.form.address.label'
  | 'listing.upload.form.address.placeholder'
  | 'listing.upload.form.address.searching'
  | 'listing.upload.form.startDate.label'
  | 'listing.upload.form.startDate.placeholder'
  | 'listing.upload.form.endDate.label'
  | 'listing.upload.form.endDate.placeholder'
  | 'listing.upload.form.city.label'
  | 'listing.upload.form.city.placeholder'
  | 'listing.upload.form.category.label'
  | 'listing.upload.form.category.placeholder'
  | 'listing.upload.form.subCategory.label'
  | 'listing.upload.form.subCategory.placeholder'
  | 'listing.upload.form.tags.label'
  | 'listing.upload.form.tags.placeholder'
  | 'listing.upload.form.summary.label'
  | 'listing.upload.form.summary.placeholder'
  | 'listing.upload.form.listingDescription.label'
  | 'listing.upload.form.listingDescription.placeholder'
  | 'listing.upload.form.email.label'
  | 'listing.upload.form.email.placeholder'
  | 'listing.upload.form.phone.label'
  | 'listing.upload.form.phone.placeholder'
  | 'listing.upload.form.websiteUrl.label'
  | 'listing.upload.form.websiteUrl.placeholder'
  | 'listing.upload.form.media.label'
  | 'listing.edit.heading'
  | 'listing.edit.description'
  | 'listing.listingHeading'
  | 'listing.listingDescription'
  | 'listing.searchPlaceholder'
  | 'listing.active'
  | 'listing.inactive'
  | 'listing.tabs.allLists'
  | 'listing.tabs.pendingLists'
  | 'listing.tabs.inactiveLists'
  | 'listing.tabs.hiddenLists'
  | 'listing.table.head.list'
  | 'listing.table.head.status'
  | 'listing.table.head.description'
  | 'listing.table.head.actions'
  | 'listing.table.noData'
  | 'list.upload.dummyText'
  | 'list.upload.defaultHeader'
  | 'list.upload.listPreviewDescription'
  | 'list.upload.previewHeading'
  | 'list.upload.previewDescription'
  | 'list.upload.dateFormat'
  | 'removeImage'
  | 'deleteMetadata'
  | 'removeSubcategory'
  | 'termsConditions.noData';
