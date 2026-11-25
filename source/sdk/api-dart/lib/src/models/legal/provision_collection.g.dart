// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'provision_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalProvisionCollection _$LegalProvisionCollectionFromJson(Map<String, dynamic> json) => LegalProvisionCollection(
  provisions: (json['provisions'] as List<dynamic>).map((e) => LegalProvisionEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$LegalProvisionCollectionToJson(LegalProvisionCollection instance) => <String, dynamic>{'provisions': instance.provisions};
