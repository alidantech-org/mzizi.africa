// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instrument_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalInstrumentWindow _$LegalInstrumentWindowFromJson(Map<String, dynamic> json) => LegalInstrumentWindow(
  kindTerm: json['kindTerm'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$LegalInstrumentWindowToJson(LegalInstrumentWindow instance) => <String, dynamic>{
  'kindTerm': ?instance.kindTerm,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
