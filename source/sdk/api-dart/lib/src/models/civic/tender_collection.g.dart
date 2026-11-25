// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tender_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicTenderCollection _$CivicTenderCollectionFromJson(Map<String, dynamic> json) =>
    CivicTenderCollection(tenders: (json['tenders'] as List<dynamic>).map((e) => CivicTenderEntry.fromJson(e as Map<String, dynamic>)).toList());

Map<String, dynamic> _$CivicTenderCollectionToJson(CivicTenderCollection instance) => <String, dynamic>{'tenders': instance.tenders};
