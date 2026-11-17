import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_identified.dart';

part 'coded_created.g.dart';

/// Base for operational records with a unique identity code and creation time.
@JsonSerializable(includeIfNull: false)
class SharedCodedCreated {
  const SharedCodedCreated({required this.code, required this.createdAt, required this.id});
  final String code;
  final DateTime createdAt;
  final String id;

  factory SharedCodedCreated.fromJson(Map<String, dynamic> json) => _$SharedCodedCreatedFromJson(json);

  Map<String, dynamic> toJson() => _$SharedCodedCreatedToJson(this);
}
