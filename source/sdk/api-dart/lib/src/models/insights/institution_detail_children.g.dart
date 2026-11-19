// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail_children.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsInstitutionDetailChildren _$InsightsInstitutionDetailChildrenFromJson(Map<String, dynamic> json) => InsightsInstitutionDetailChildren(
  children: (json['children'] as num).toDouble(),
  code: json['code'] as String,
  name: json['name'] as String,
  relation: InsightsInstitutionDetailChildrenRelation.fromJson(json['relation'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsInstitutionDetailChildrenToJson(InsightsInstitutionDetailChildren instance) => <String, dynamic>{
  'children': instance.children,
  'code': instance.code,
  'name': instance.name,
  'relation': instance.relation,
};
