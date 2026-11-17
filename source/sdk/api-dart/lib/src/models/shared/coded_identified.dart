import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/identified.dart';

part 'coded_identified.g.dart';

/// Base for operational records with a unique identity code.
@JsonSerializable(includeIfNull: false)
class SharedCodedIdentified {
  const SharedCodedIdentified({required this.code, required this.id});
  final String code;
  final String id;

  factory SharedCodedIdentified.fromJson(Map<String, dynamic> json) => _$SharedCodedIdentifiedFromJson(json);

  Map<String, dynamic> toJson() => _$SharedCodedIdentifiedToJson(this);
}
