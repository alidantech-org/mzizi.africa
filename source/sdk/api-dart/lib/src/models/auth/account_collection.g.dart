// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthAccountCollection _$AuthAccountCollectionFromJson(Map<String, dynamic> json) => AuthAccountCollection(
  accounts: (json['accounts'] as List<dynamic>).map((e) => AuthAccountSummary.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$AuthAccountCollectionToJson(AuthAccountCollection instance) => <String, dynamic>{'accounts': instance.accounts};
