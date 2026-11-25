// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendInstitutionRequest _$FrontendInstitutionRequestFromJson(Map<String, dynamic> json) =>
    FrontendInstitutionRequest(country: json['country'] as String, institution: json['institution'] as String, lang: json['lang'] as String?);

Map<String, dynamic> _$FrontendInstitutionRequestToJson(FrontendInstitutionRequest instance) => <String, dynamic>{
  'country': instance.country,
  'institution': instance.institution,
  'lang': ?instance.lang,
};
