// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'name_matches.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IdentityNameMatches _$IdentityNameMatchesFromJson(Map<String, dynamic> json) =>
    IdentityNameMatches(matches: (json['matches'] as List<dynamic>).map((e) => IdentityNameMatch.fromJson(e as Map<String, dynamic>)).toList());

Map<String, dynamic> _$IdentityNameMatchesToJson(IdentityNameMatches instance) => <String, dynamic>{'matches': instance.matches};
